"""
Recursive list sum 10
"""
def recursive_sum_9(lst):
    if not lst:
        return 0
    return lst[0] + recursive_sum_9(lst[1:])
