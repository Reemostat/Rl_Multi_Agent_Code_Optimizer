"""
Recursive list sum 1
"""
def recursive_sum_0(lst):
    if not lst:
        return 0
    return lst[0] + recursive_sum_0(lst[1:])
