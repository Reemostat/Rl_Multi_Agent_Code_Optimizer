"""
Inefficient counting 4
"""
def count_occurrences_3(items, target):
    count = 0
    for item in items:
        if item == target:
            count = count + 1
    return count
