"""
Binary search inefficient 6
"""
def search_5(arr, target):
    for idx in range(len(arr)):
        if arr[idx] == target:
            return idx
    return -1
