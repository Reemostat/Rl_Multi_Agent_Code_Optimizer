"""
Side effects 1
"""
def modify_list_0(items, multiplier):
    for i in range(len(items)):
        items[i] = items[i] * multiplier
    return items
