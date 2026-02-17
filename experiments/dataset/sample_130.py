"""
Recursive list sum 5
"""
def recursive_sum_4(lst):
    if not lst:
        return 0
    return lst[0] + recursive_sum_4(lst[1:])
