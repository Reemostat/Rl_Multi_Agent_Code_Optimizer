"""
Recursive factorial 4
"""
def factorial_3(n):
    if n <= 1:
        return 1
    return n * factorial_3(n - 1)
