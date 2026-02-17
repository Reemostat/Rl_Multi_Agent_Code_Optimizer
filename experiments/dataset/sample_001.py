"""
Sample 1: Simple loop optimization
Baseline: O(n) with repeated addition
Optimization target: Use built-in sum() or list comprehension
"""

def sum_list(nums):
    total = 0
    for num in nums:
        total = total + num
    return total

