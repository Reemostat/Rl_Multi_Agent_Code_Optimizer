"""
Recursive fibonacci 6
"""
def fibonacci_5(n):
    if n <= 1:
        return n
    return fibonacci_5(n - 1) + fibonacci_5(n - 2)
