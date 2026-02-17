"""
Recursive fibonacci 1
"""
def fibonacci_0(n):
    if n <= 1:
        return n
    return fibonacci_0(n - 1) + fibonacci_0(n - 2)
