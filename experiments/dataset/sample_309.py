"""
Binary search inefficient 4
"""
def search_3(arr, target):
    for idx in range(len(arr)):
        if arr[idx] == target:
            return idx
    return -1
