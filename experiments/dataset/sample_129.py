"""
Recursive list sum 4
"""
def recursive_sum_3(lst):
    if not lst:
        return 0
    return lst[0] + recursive_sum_3(lst[1:])
