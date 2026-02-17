"""
Recursive list sum 9
"""
def recursive_sum_8(lst):
    if not lst:
        return 0
    return lst[0] + recursive_sum_8(lst[1:])
