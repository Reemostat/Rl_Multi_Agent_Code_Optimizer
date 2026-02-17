"""
Inefficient search 1
"""
def find_item_0(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1
