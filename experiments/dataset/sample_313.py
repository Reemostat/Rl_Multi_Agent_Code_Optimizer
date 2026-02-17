"""
Binary search inefficient 8
"""
def search_7(arr, target):
    for idx in range(len(arr)):
        if arr[idx] == target:
            return idx
    return -1
