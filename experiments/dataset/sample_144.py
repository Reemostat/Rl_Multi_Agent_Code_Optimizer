"""
Inefficient search 9
"""
def find_item_8(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1
