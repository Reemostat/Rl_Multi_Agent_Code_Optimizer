"""
Nested loop inefficiency 10
"""
def find_pairs_9(arr1, arr2, target):
    result = []
    for i in range(len(arr1)):
        for j in range(len(arr2)):
            if arr1[i] + arr2[j] == target:
                result.append((i, j))
    return result
