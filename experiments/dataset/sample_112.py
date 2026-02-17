"""
Recursive factorial 7
"""
def factorial_6(n):
    if n <= 1:
        return 1
    return n * factorial_6(n - 1)
