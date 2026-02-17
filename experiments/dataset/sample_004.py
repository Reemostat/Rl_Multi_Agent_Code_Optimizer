"""
Sample 4: Nested loop optimization
Baseline: O(n²) nested loops
Optimization target: Use set or dict for O(n) lookup
"""

def find_duplicates(arr1, arr2):
    result = []
    for item1 in arr1:
        for item2 in arr2:
            if item1 == item2:
                result.append(item1)
                break
    return result

