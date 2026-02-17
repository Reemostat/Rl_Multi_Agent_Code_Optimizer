"""
Side effects 5
"""
def modify_list_4(items, multiplier):
    for i in range(len(items)):
        items[i] = items[i] * multiplier
    return items
