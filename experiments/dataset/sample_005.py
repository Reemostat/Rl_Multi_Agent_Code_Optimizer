"""
Sample 5: Memory optimization
Baseline: Creating new list each iteration
Optimization target: In-place operations or generator
"""

def filter_positive(numbers):
    result = []
    for num in numbers:
        if num > 0:
            result.append(num)
    return result

