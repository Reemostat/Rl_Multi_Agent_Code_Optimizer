"""
Binary search inefficient 1
"""
def search_0(arr, target):
    for idx in range(len(arr)):
        if arr[idx] == target:
            return idx
    return -1
