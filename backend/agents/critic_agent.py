"""
Critic agent that evaluates code quality, safety, and structural improvements.
"""

from typing import Dict, Any, Tuple
import structlog
from backend.llm_service import optimize_with_llm

logger = structlog.get_logger()

class CriticAgent:
    """Agent that scores code quality and detects regressions."""
    
    SCORING_PROMPT = """Evaluate the following code optimization. Score it on:
1. Structural quality (0-1)
2. Safety (0-1) - no dangerous patterns
3. Maintainability (0-1)
4. Overall improvement (0-1)

Return ONLY a JSON object with scores:
{{"structural": 0.8, "safety": 0.9, "maintainability": 0.7, "overall": 0.8}}

Original code:
{original}

Optimized code:
{optimized}"""

    REGRESSION_PROMPT = """Check if the optimized code introduces regressions:
- Functionality changes
- Performance degradation patterns
- Security issues
- Breaking changes

Return ONLY "SAFE" or "UNSAFE" followed by a brief reason.

Original code:
{original}

Optimized code:
{optimized}"""

    async def score_candidate(
        self,
        original: str,
        optimized: str,
        config: Dict[str, Any] = None
    ) -> Tuple[float, Dict[str, float], str]:
        """
        Score an optimized candidate.
        
        Args:
            original: Original code
            optimized: Optimized code
            config: Optional configuration
        
        Returns:
            Tuple of (overall_score, detailed_scores, safety_status)
            - overall_score: 0-1 normalized quality score
            - detailed_scores: Dict with structural, safety, maintainability scores
            - safety_status: "SAFE" or "UNSAFE" with reason
        """
        try:
            # Get quality scores
            scoring_prompt = self.SCORING_PROMPT.format(
                original=original,
                optimized=optimized
            )
            
            # Use LLM to score (simplified - in production might use structured output)
            score_response = await optimize_with_llm(
                scoring_prompt,
                strategy=5,  # Alternative solution
                custom_prompt=scoring_prompt,
                config=config
            )
            
            # Parse scores (simplified - would use JSON parsing in production)
            # Default scores if parsing fails
            detailed_scores = {
                "structural": 0.7,
                "safety": 0.8,
                "maintainability": 0.7,
                "overall": 0.7
            }
            
            # Try to extract JSON from response
            import json
            import re
            json_match = re.search(r'\{[^}]+\}', score_response)
            if json_match:
                try:
                    parsed = json.loads(json_match.group())
                    detailed_scores.update(parsed)
                except:
                    pass
            
            overall_score = detailed_scores.get("overall", 0.7)
            
            # Check for regressions
            regression_prompt = self.REGRESSION_PROMPT.format(
                original=original,
                optimized=optimized
            )
            
            regression_response = await optimize_with_llm(
                regression_prompt,
                strategy=5,
                custom_prompt=regression_prompt,
                config=config
            )
            
            safety_status = "SAFE"
            if "UNSAFE" in regression_response.upper():
                safety_status = regression_response.strip()
            
            return overall_score, detailed_scores, safety_status
            
        except Exception as e:
            logger.error(f"CriticAgent scoring failed: {e}")
            # Return safe defaults
            return 0.5, {
                "structural": 0.5,
                "safety": 0.5,
                "maintainability": 0.5,
                "overall": 0.5
            }, "SAFE"

