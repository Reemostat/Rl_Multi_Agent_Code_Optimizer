"""
Readability optimization agent focused on code structure and clarity.
"""

from typing import Dict, Any
import structlog
from backend.llm_service import optimize_with_llm

logger = structlog.get_logger()

class ReadabilityAgent:
    """Agent specialized in code readability and maintainability."""
    
    PROMPT_TEMPLATE = """You are an expert code optimizer specializing in code readability and maintainability.

Given the following Python code, refactor it to improve:
- Code structure and modularity
- Variable naming clarity
- Function decomposition
- Documentation and comments
- Overall maintainability

While maintaining the same functionality, make the code more readable and maintainable.
Return ONLY the refactored code, no explanations.

Code to optimize:
{code}"""

    async def generate_candidate(self, code: str, config: Dict[str, Any] = None) -> str:
        """
        Generate an optimized candidate focused on readability improvements.
        
        Args:
            code: Original code to optimize
            config: Optional configuration
        
        Returns:
            Optimized code string
        """
        try:
            # Use strategy 5 (alternative solution) for readability focus
            optimized = await optimize_with_llm(
                code,
                strategy=5,  # Alternative solution strategy
                custom_prompt=self.PROMPT_TEMPLATE.format(code=code),
                config=config
            )
            return optimized
        except Exception as e:
            logger.error(f"ReadabilityAgent failed: {e}")
            return code  # Return original on failure

