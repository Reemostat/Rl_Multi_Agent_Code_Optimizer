"""
Inefficient search 3
"""
def find_item_2(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1
