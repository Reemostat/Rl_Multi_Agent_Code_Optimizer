"""
Recursive factorial 6
"""
def factorial_5(n):
    if n <= 1:
        return 1
    return n * factorial_5(n - 1)
