"""
Recursive fibonacci 5
"""
def fibonacci_4(n):
    if n <= 1:
        return n
    return fibonacci_4(n - 1) + fibonacci_4(n - 2)
