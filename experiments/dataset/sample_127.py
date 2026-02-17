"""
Recursive list sum 2
"""
def recursive_sum_1(lst):
    if not lst:
        return 0
    return lst[0] + recursive_sum_1(lst[1:])
