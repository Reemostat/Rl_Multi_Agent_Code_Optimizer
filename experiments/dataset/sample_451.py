"""
Side effects 6
"""
def modify_list_5(items, multiplier):
    for i in range(len(items)):
        items[i] = items[i] * multiplier
    return items
