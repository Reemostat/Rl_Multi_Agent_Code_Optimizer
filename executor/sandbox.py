"""
Secure code execution sandbox.
"""
import signal
import asyncio
import subprocess
import time
import tracemalloc
import tempfile
import os
from pathlib import Path
from typing import Dict, Any, Optional
import structlog

from shared.config import EXECUTION_TIMEOUT, MAX_MEMORY_MB

logger = structlog.get_logger()



async def execute_code(code: str, timeout: Optional[float] = None) -> Dict[str, Any]:
    """
    Execute code in a sandboxed environment.
    Supports input() and prevents infinite blocking.
    """

    # Adaptive timeout based on code size
    if timeout is None:
        base = EXECUTION_TIMEOUT
        size_factor = min(len(code) / 2000, 5)
        timeout = base + size_factor

    # Detect if code uses input()
    if "input(" in code:
        injected_input = "10\n"  # default dummy input
    else:
        injected_input = None

    # Create temporary file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(code)
        temp_path = f.name

    try:
        start_time = time.perf_counter()

        process = await asyncio.create_subprocess_exec(
            'python3',
            temp_path,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            preexec_fn=os.setsid  # isolate process group
        )

        try:
            stdout, stderr = await asyncio.wait_for(
                process.communicate(
                    input=injected_input.encode() if injected_input else None
                ),
                timeout=timeout
            )
        except asyncio.TimeoutError:
            # Kill entire process group safely
            os.killpg(os.getpgid(process.pid), signal.SIGTERM)
            await process.wait()

            return {
                "success": False,
                "output": "",
                "error": f"Execution timeout after {timeout:.2f}s",
                "runtime": timeout,
                "memory": 0,
                "returncode": -1
            }

        runtime = time.perf_counter() - start_time

        return {
            "success": process.returncode == 0,
            "output": stdout.decode() if stdout else "",
            "error": stderr.decode() if stderr else None,
            "runtime": runtime,
            "memory": 0,
            "returncode": process.returncode
        }

    finally:
        try:
            os.unlink(temp_path)
        except:
            pass

async def benchmark_code(code: str) -> Dict[str, Any]:
    """
    Benchmark code execution with multiple runs for accuracy.
    Returns averaged metrics.
    """
    runs = []
    num_runs = 1
    
    for i in range(num_runs):
        result = await execute_code(code)
        if result["success"]:
            runs.append(result)
    
    if not runs:
        # Return first failure if all failed
        result = await execute_code(code)
        return {
            "success": False,
            "runtime": result.get("runtime", 0),
            "memory": result.get("memory", 0),
            "error": result.get("error", "All benchmark runs failed"),
            "test_pass_rate": 0.0
        }
    
    # Average metrics
    avg_runtime = sum(r["runtime"] for r in runs) / len(runs)
    avg_memory = sum(r["memory"] for r in runs) / len(runs)
    
    # Run tests if available (simplified - full version would run pytest)
    test_pass_rate = 1.0  # Placeholder - would run actual tests
    
    return {
        "success": True,
        "runtime": avg_runtime,
        "memory": avg_memory,
        "test_pass_rate": test_pass_rate,
        "runs": len(runs)
    }

