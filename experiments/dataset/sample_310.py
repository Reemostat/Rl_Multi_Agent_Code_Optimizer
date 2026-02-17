"""
Binary search inefficient 5
"""
def search_4(arr, target):
    for idx in range(len(arr)):
        if arr[idx] == target:
            return idx
    return -1
