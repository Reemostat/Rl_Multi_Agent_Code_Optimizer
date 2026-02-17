"""
Recursive factorial 3
"""
def factorial_2(n):
    if n <= 1:
        return 1
    return n * factorial_2(n - 1)
