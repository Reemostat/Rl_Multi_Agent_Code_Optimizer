"""
Side effects 4
"""
def modify_list_3(items, multiplier):
    for i in range(len(items)):
        items[i] = items[i] * multiplier
    return items
