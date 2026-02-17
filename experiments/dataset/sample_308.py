"""
Binary search inefficient 3
"""
def search_2(arr, target):
    for idx in range(len(arr)):
        if arr[idx] == target:
            return idx
    return -1
