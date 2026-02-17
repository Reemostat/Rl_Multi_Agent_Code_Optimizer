"""
Sample 2: List comprehension optimization
Baseline: Append in loop
Optimization target: List comprehension
"""

def square_numbers(nums):
    result = []
    for num in nums:
        result.append(num * num)
    return result

