"""
Memory optimization agent focused on reducing memory usage.
"""

from typing import Dict, Any
import structlog
from backend.llm_service import optimize_with_llm

logger = structlog.get_logger()

class MemoryAgent:
    """Agent specialized in memory optimizations."""
    
    PROMPT_TEMPLATE = """You are an expert code optimizer specializing in memory efficiency.

Given the following Python code, optimize it to reduce memory usage through:
- Using generators instead of lists where possible
- In-place operations
- Memory-efficient data structures
- Reducing object creation
- Avoiding unnecessary copies

Focus ONLY on memory usage. Return ONLY the optimized code, no explanations.

Code to optimize:
{code}"""

    async def generate_candidate(self, code: str, config: Dict[str, Any] = None) -> str:
        """
        Generate an optimized candidate focused on memory improvements.
        
        Args:
            code: Original code to optimize
            config: Optional configuration
        
        Returns:
            Optimized code string
        """
        try:
            # Use strategy 1 (memory optimization)
            optimized = await optimize_with_llm(
                code,
                strategy=1,  # Memory optimization strategy
                custom_prompt=self.PROMPT_TEMPLATE.format(code=code),
                config=config
            )
            return optimized
        except Exception as e:
            logger.error(f"MemoryAgent failed: {e}")
            return code  # Return original on failure

