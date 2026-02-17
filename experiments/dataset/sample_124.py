"""
Recursive fibonacci 9
"""
def fibonacci_8(n):
    if n <= 1:
        return n
    return fibonacci_8(n - 1) + fibonacci_8(n - 2)
