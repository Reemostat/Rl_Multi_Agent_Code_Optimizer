"""
Strategy-specific prompts for code optimization.
"""

STRATEGY_PROMPTS = {
    0: """You are an expert code optimizer specializing in algorithmic improvements.
Given the following Python code, rewrite it to improve runtime performance through better algorithms, data structures, or algorithmic optimizations.
Focus on: reducing time complexity, using more efficient data structures, eliminating redundant operations.
Return ONLY the optimized code, no explanations.

Code to optimize:
{code}""",

    1: """You are an expert code optimizer specializing in memory efficiency.
Given the following Python code, rewrite it to reduce memory usage.
Focus on: reducing object creation, using generators, in-place operations, memory-efficient data structures.
Return ONLY the optimized code, no explanations.

Code to optimize:
{code}""",

    2: """You are an expert code optimizer specializing in in-place mutations.
Given the following Python code, rewrite it using in-place operations where possible to reduce memory allocations.
Focus on: modifying existing objects instead of creating new ones, using slice assignments, list comprehensions with in-place operations.
Return ONLY the optimized code, no explanations.

Code to optimize:
{code}""",

    3: """You are an expert code optimizer specializing in recursion elimination.
Given the following Python code, rewrite it to convert recursion to iteration using stacks or loops.
Focus on: eliminating function call overhead, avoiding stack overflow, improving performance.
Return ONLY the optimized code, no explanations.

Code to optimize:
{code}""",

    4: """You are an expert code optimizer specializing in vectorization.
Given the following Python code, rewrite it to use NumPy vectorization or list comprehensions to eliminate loops where possible.
Focus on: replacing explicit loops with vectorized operations, using NumPy arrays efficiently.
Return ONLY the optimized code, no explanations.

Code to optimize:
{code}""",

    5: """You are an expert code optimizer with full creative freedom.
Given the following Python code, rewrite it using any optimization strategy you think will work best.
Consider all aspects: runtime, memory, readability, maintainability.
Return ONLY the optimized code, no explanations.

Code to optimize:
{code}""",
}

def get_prompt(strategy: int, code: str) -> str:
    """Get the prompt for a given strategy."""
    if strategy not in STRATEGY_PROMPTS:
        strategy = 5  # Fallback to alternative solution
    return STRATEGY_PROMPTS[strategy].format(code=code)

