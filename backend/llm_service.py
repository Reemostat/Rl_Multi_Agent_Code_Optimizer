"""
LLM service for code optimization using OpenAI via LiteLLM.
"""

import os
from typing import Optional
import litellm
from litellm import completion
import structlog

from shared.prompts import get_prompt
from shared.config import MAX_TOKENS, TEMPERATURE

logger = structlog.get_logger()

# Configure LiteLLM
litellm.set_verbose = False

async def optimize_with_llm(
    code: str,
    strategy: int,
    custom_prompt: Optional[str] = None,
    config: Optional[dict] = None
) -> str:
    """
    Optimize code using LLM with specified strategy.
    
    Args:
        code: Code to optimize
        strategy: Strategy index (0-6)
        custom_prompt: Optional custom prompt (overrides strategy prompt)
        config: Optional config dict with max_tokens, temperature, etc.
    
    Returns:
        Optimized code string
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY not configured")
    
    # Use custom prompt if provided, otherwise use strategy prompt
    if custom_prompt:
        prompt = custom_prompt
    else:
        prompt = get_prompt(strategy, code)
    
    # Get config overrides
    max_tokens = config.get("max_tokens", MAX_TOKENS) if config else MAX_TOKENS
    temperature = config.get("temperature", TEMPERATURE) if config else TEMPERATURE
    
    try:
        response = completion(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert code optimizer. Return only optimized code, no explanations."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=max_tokens,
            temperature=temperature,
            api_key=api_key
        )
        
        optimized_code = response.choices[0].message.content.strip()
        
        # Extract code if wrapped in markdown code blocks
        if optimized_code.startswith("```"):
            lines = optimized_code.split('\n')
            # Remove first line (```python or ```)
            if len(lines) > 1:
                lines = lines[1:]
            # Remove last line if it's ```
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            optimized_code = '\n'.join(lines)
        
        return optimized_code
    
    except Exception as e:
        logger.error(f"LLM optimization failed: {e}")
        raise ValueError(f"LLM optimization failed: {str(e)}")

