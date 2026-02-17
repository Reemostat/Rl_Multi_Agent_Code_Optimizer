"""
Inefficient search 10
"""
def find_item_9(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1
