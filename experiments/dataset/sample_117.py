"""
Recursive fibonacci 2
"""
def fibonacci_1(n):
    if n <= 1:
        return n
    return fibonacci_1(n - 1) + fibonacci_1(n - 2)
