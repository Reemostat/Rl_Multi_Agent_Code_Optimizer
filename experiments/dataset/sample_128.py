"""
Recursive list sum 3
"""
def recursive_sum_2(lst):
    if not lst:
        return 0
    return lst[0] + recursive_sum_2(lst[1:])
