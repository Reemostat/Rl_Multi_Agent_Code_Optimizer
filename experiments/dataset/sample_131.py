"""
Recursive list sum 6
"""
def recursive_sum_5(lst):
    if not lst:
        return 0
    return lst[0] + recursive_sum_5(lst[1:])
