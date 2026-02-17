"""
Frequent lookups 9
"""
def process_items_8(items, lookup):
    result = []
    for item in items:
        found = False
        for key in lookup:
            if key == item:
                found = True
                break
        result.append(found)
    return result
