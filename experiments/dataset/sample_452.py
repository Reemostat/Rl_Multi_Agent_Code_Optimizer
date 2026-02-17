"""
Side effects 7
"""
def modify_list_6(items, multiplier):
    for i in range(len(items)):
        items[i] = items[i] * multiplier
    return items
