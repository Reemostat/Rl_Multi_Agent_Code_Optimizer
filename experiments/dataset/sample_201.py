"""
Inefficient counting 6
"""
def count_occurrences_5(items, target):
    count = 0
    for item in items:
        if item == target:
            count = count + 1
    return count
