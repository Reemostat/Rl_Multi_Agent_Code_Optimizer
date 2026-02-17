"""
Inefficient search 6
"""
def find_item_5(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1
