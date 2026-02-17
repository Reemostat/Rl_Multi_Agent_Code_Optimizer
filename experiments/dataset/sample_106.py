"""
Recursive factorial 1
"""
def factorial_0(n):
    if n <= 1:
        return 1
    return n * factorial_0(n - 1)
