"""
Recursive factorial 9
"""
def factorial_8(n):
    if n <= 1:
        return 1
    return n * factorial_8(n - 1)
