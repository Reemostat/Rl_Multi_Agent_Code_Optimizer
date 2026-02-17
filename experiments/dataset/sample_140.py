"""
Inefficient search 5
"""
def find_item_4(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1
