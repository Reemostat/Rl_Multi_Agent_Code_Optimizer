"""
Recursive fibonacci 4
"""
def fibonacci_3(n):
    if n <= 1:
        return n
    return fibonacci_3(n - 1) + fibonacci_3(n - 2)
