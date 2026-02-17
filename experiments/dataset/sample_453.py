"""
Side effects 8
"""
def modify_list_7(items, multiplier):
    for i in range(len(items)):
        items[i] = items[i] * multiplier
    return items
