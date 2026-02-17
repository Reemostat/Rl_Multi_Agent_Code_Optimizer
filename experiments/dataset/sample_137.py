"""
Inefficient search 2
"""
def find_item_1(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1
