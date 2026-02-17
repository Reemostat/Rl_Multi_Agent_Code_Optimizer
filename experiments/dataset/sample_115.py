"""
Recursive factorial 10
"""
def factorial_9(n):
    if n <= 1:
        return 1
    return n * factorial_9(n - 1)
