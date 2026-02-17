"""
Recursive factorial 2
"""
def factorial_1(n):
    if n <= 1:
        return 1
    return n * factorial_1(n - 1)
