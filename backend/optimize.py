"""
Code optimization endpoint logic.
"""

import difflib
from typing import Dict, Any
import structlog

from backend.rl_model import get_strategy
from backend.llm_service import optimize_with_llm
from executor.sandbox import execute_code, benchmark_code
from shared.sanitize import sanitize_code
from shared.config import MAX_REFINEMENT_STEPS

logger = structlog.get_logger()

STRATEGY_LABELS = {
    0: "Algorithmic Optimization",
    1: "Memory Optimization",
    2: "In-place Refactor",
    3: "Recursion-to-Iteration",
    4: "Vectorization",
    5: "Alternative Solution",
    6: "Stop"
}

async def optimize_code(code: str, max_refinements: int = 3) -> Dict[str, Any]:
    """
    Optimize code using RL model to select strategy.
    Returns optimized code, strategy, reward, metrics, and diff.
    """
    # Sanitize input code
    sanitized_code, warnings = sanitize_code(code)
    if not sanitized_code:
        raise ValueError("Code sanitization failed or code is empty")
    
    # Get baseline metrics
    baseline_result = await benchmark_code(sanitized_code)
    if not baseline_result["success"]:
        raise ValueError(f"Baseline execution failed: {baseline_result.get('error')}")
    
    baseline_runtime = baseline_result["runtime"]
    baseline_memory = baseline_result["memory"]
    
    # Initialize state for RL
    current_code = sanitized_code
    best_code = sanitized_code
    best_reward = -1.0
    best_strategy = 6  # Stop
    
    # RL-guided optimization loop
    for step in range(max_refinements):
        # Get state encoding
        try:
            from rl.services.state_encoder import encode_state
            state = encode_state(current_code, baseline_runtime, baseline_memory)
        except Exception as e:
            logger.warning(f"State encoding failed: {e}, using default strategy")
            state = None
        
        # Get strategy from RL model
        if state is not None:
            strategy = get_strategy(state)
        else:
            strategy = 0  # Default to algorithmic optimization
        
        if strategy == 6:  # Stop action
            break
        
        # Optimize with selected strategy
        try:
            optimized_code = await optimize_with_llm(current_code, strategy)
            
            # Sanitize optimized code
            opt_sanitized, opt_warnings = sanitize_code(optimized_code)
            if not opt_sanitized:
                logger.warning(f"Optimized code failed sanitization at step {step}")
                continue
            
            # Benchmark optimized code
            opt_result = await benchmark_code(opt_sanitized)
            if not opt_result["success"]:
                logger.warning(f"Optimized code execution failed at step {step}")
                continue
            
            # Calculate reward
            reward = calculate_reward(
                baseline_runtime=baseline_runtime,
                baseline_memory=baseline_memory,
                opt_runtime=opt_result["runtime"],
                opt_memory=opt_result["memory"],
                baseline_code=current_code,
                opt_code=opt_sanitized,
                test_pass_rate=opt_result.get("test_pass_rate", 0.0)
            )
            
            # Update best if improved
            if reward > best_reward:
                best_reward = reward
                best_code = opt_sanitized
                best_strategy = strategy
                current_code = opt_sanitized  # Continue from best
                warnings.extend(opt_warnings)
            
        except Exception as e:
            logger.error(f"Optimization step {step} failed: {e}")
            continue
    
    # Final benchmark of best code
    final_result = await benchmark_code(best_code)
    
    # Generate diff
    diff = generate_diff(sanitized_code, best_code)
    
    # Calculate final metrics
    runtime_improvement = ((baseline_runtime - final_result["runtime"]) / baseline_runtime * 100) if baseline_runtime > 0 else 0
    memory_improvement = ((baseline_memory - final_result["memory"]) / baseline_memory * 100) if baseline_memory > 0 else 0
    
    return {
        "optimized_code": best_code,
        "strategy": best_strategy,
        "strategy_label": STRATEGY_LABELS.get(best_strategy, "Unknown"),
        "reward": best_reward,
        "metrics": {
            "baseline_runtime": baseline_runtime,
            "baseline_memory": baseline_memory,
            "optimized_runtime": final_result["runtime"],
            "optimized_memory": final_result["memory"],
            "runtime_improvement_pct": runtime_improvement,
            "memory_improvement_pct": memory_improvement,
            "test_pass_rate": final_result.get("test_pass_rate", 0.0),
        },
        "diff": diff,
        "warnings": warnings
    }

def calculate_reward(
    baseline_runtime: float,
    baseline_memory: float,
    opt_runtime: float,
    opt_memory: float,
    baseline_code: str,
    opt_code: str,
    test_pass_rate: float
) -> float:
    """Calculate reward based on improvements."""
    from shared.config import REWARD_WEIGHTS
    
    # Runtime improvement ratio (clipped to [-1, 1])
    if baseline_runtime > 0:
        runtime_ratio = (baseline_runtime - opt_runtime) / baseline_runtime
        runtime_ratio = max(-1, min(1, runtime_ratio))
    else:
        runtime_ratio = 0
    
    # Memory improvement ratio
    if baseline_memory > 0:
        memory_ratio = (baseline_memory - opt_memory) / baseline_memory
        memory_ratio = max(-1, min(1, memory_ratio))
    else:
        memory_ratio = 0
    
    # Code length growth (negative if code gets longer)
    baseline_lines = len(baseline_code.split('\n'))
    opt_lines = len(opt_code.split('\n'))
    if baseline_lines > 0:
        length_growth = (opt_lines - baseline_lines) / baseline_lines
    else:
        length_growth = 0
    
    # Complexity increase (simplified - full version uses radon)
    # For now, use line count as proxy
    complexity_increase = length_growth
    
    # Calculate weighted reward
    reward = (
        REWARD_WEIGHTS['runtime'] * runtime_ratio +
        REWARD_WEIGHTS['memory'] * memory_ratio +
        REWARD_WEIGHTS['test_pass'] * test_pass_rate -
        REWARD_WEIGHTS['code_length'] * abs(length_growth) -
        REWARD_WEIGHTS['complexity'] * abs(complexity_increase)
    )
    
    # Clip to [-1, 1]
    return max(-1.0, min(1.0, reward))

def generate_diff(original: str, optimized: str) -> Dict[str, Any]:
    """Generate diff between original and optimized code."""
    original_lines = original.split('\n')
    optimized_lines = optimized.split('\n')
    
    diff = list(difflib.unified_diff(
        original_lines,
        optimized_lines,
        lineterm='',
        fromfile='original',
        tofile='optimized'
    ))
    
    return {
        "unified_diff": diff,
        "original_lines": len(original_lines),
        "optimized_lines": len(optimized_lines),
        "line_changes": len([d for d in diff if d.startswith(('+', '-')) and not d.startswith(('+++', '---'))])
    }

