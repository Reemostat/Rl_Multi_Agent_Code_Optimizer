"""
Side effects 10
"""
def modify_list_9(items, multiplier):
    for i in range(len(items)):
        items[i] = items[i] * multiplier
    return items
