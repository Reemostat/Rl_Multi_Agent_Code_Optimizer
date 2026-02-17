"""
Recursive fibonacci 3
"""
def fibonacci_2(n):
    if n <= 1:
        return n
    return fibonacci_2(n - 1) + fibonacci_2(n - 2)
