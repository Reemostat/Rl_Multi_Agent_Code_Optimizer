"""
Inefficient search 7
"""
def find_item_6(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1
