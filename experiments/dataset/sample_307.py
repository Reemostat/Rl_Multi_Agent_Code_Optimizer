"""
Binary search inefficient 2
"""
def search_1(arr, target):
    for idx in range(len(arr)):
        if arr[idx] == target:
            return idx
    return -1
