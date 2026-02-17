"""
Sample 3: Recursive function
Baseline: Recursion with stack overhead
Optimization target: Iterative version
"""

def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

