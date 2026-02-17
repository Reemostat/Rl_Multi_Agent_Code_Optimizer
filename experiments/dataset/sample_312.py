"""
Binary search inefficient 7
"""
def search_6(arr, target):
    for idx in range(len(arr)):
        if arr[idx] == target:
            return idx
    return -1
