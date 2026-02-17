"""
Inefficient counting 3
"""
def count_occurrences_2(items, target):
    count = 0
    for item in items:
        if item == target:
            count = count + 1
    return count
