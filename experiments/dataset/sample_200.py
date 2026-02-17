"""
Inefficient counting 5
"""
def count_occurrences_4(items, target):
    count = 0
    for item in items:
        if item == target:
            count = count + 1
    return count
