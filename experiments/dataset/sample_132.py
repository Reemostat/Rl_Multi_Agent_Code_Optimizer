"""
Recursive list sum 7
"""
def recursive_sum_6(lst):
    if not lst:
        return 0
    return lst[0] + recursive_sum_6(lst[1:])
