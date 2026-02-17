"""
Binary search inefficient 9
"""
def search_8(arr, target):
    for idx in range(len(arr)):
        if arr[idx] == target:
            return idx
    return -1
