"""
Runtime optimization agent focused on algorithmic improvements.
"""

from typing import Dict, Any
import structlog
from backend.llm_service import optimize_with_llm

logger = structlog.get_logger()

class RuntimeAgent:
    """Agent specialized in runtime/algorithmic optimizations."""
    
    PROMPT_TEMPLATE = """You are an expert code optimizer specializing in runtime performance improvements.

Given the following Python code, optimize it to improve execution speed through:
- Better algorithms and data structures
- Eliminating redundant operations
- Reducing time complexity
- Using built-in functions efficiently
- Loop optimizations

Focus ONLY on runtime performance. Return ONLY the optimized code, no explanations.

Code to optimize:
{code}"""

    async def generate_candidate(self, code: str, config: Dict[str, Any] = None) -> str:
        """
        Generate an optimized candidate focused on runtime improvements.
        
        Args:
            code: Original code to optimize
            config: Optional configuration (temperature, max_tokens, etc.)
        
        Returns:
            Optimized code string
        """
        try:
            # Use strategy 0 (algorithmic optimization) for runtime focus
            optimized = await optimize_with_llm(
                code,
                strategy=0,  # Algorithmic optimization strategy
                custom_prompt=self.PROMPT_TEMPLATE.format(code=code),
                config=config
            )
            return optimized
        except Exception as e:
            logger.error(f"RuntimeAgent failed: {e}")
            return code  # Return original on failure

