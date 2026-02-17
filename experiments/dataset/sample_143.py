"""
Inefficient search 8
"""
def find_item_7(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1
