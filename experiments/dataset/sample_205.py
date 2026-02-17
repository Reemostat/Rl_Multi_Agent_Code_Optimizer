"""
Inefficient counting 10
"""
def count_occurrences_9(items, target):
    count = 0
    for item in items:
        if item == target:
            count = count + 1
    return count
