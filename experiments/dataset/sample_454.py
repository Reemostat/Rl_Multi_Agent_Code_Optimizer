"""
Side effects 9
"""
def modify_list_8(items, multiplier):
    for i in range(len(items)):
        items[i] = items[i] * multiplier
    return items
