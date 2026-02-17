"""
Side effects 2
"""
def modify_list_1(items, multiplier):
    for i in range(len(items)):
        items[i] = items[i] * multiplier
    return items
