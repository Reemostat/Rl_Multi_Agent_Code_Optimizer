"""
Recursive fibonacci 8
"""
def fibonacci_7(n):
    if n <= 1:
        return n
    return fibonacci_7(n - 1) + fibonacci_7(n - 2)
