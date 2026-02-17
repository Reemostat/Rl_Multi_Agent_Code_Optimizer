"""
Recursive list sum 8
"""
def recursive_sum_7(lst):
    if not lst:
        return 0
    return lst[0] + recursive_sum_7(lst[1:])
