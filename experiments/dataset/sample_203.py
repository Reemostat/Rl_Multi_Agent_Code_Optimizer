"""
Inefficient counting 8
"""
def count_occurrences_7(items, target):
    count = 0
    for item in items:
        if item == target:
            count = count + 1
    return count
