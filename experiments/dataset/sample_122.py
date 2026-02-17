"""
Recursive fibonacci 7
"""
def fibonacci_6(n):
    if n <= 1:
        return n
    return fibonacci_6(n - 1) + fibonacci_6(n - 2)
