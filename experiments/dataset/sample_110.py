"""
Recursive factorial 5
"""
def factorial_4(n):
    if n <= 1:
        return 1
    return n * factorial_4(n - 1)
