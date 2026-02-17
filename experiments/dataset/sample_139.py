"""
Inefficient search 4
"""
def find_item_3(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1
