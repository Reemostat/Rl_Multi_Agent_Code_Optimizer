"""
Inefficient counting 2
"""
def count_occurrences_1(items, target):
    count = 0
    for item in items:
        if item == target:
            count = count + 1
    return count
