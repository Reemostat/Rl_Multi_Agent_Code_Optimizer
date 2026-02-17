"""
Inefficient counting 7
"""
def count_occurrences_6(items, target):
    count = 0
    for item in items:
        if item == target:
            count = count + 1
    return count
