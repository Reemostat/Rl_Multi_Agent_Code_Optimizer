"""
Binary search inefficient 10
"""
def search_9(arr, target):
    for idx in range(len(arr)):
        if arr[idx] == target:
            return idx
    return -1
