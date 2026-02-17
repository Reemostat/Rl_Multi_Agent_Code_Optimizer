"""
Recursive fibonacci 10
"""
def fibonacci_9(n):
    if n <= 1:
        return n
    return fibonacci_9(n - 1) + fibonacci_9(n - 2)
