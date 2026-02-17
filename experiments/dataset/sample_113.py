"""
Recursive factorial 8
"""
def factorial_7(n):
    if n <= 1:
        return 1
    return n * factorial_7(n - 1)
