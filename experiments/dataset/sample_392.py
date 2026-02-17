"""
Frequent lookups 7
"""
def process_items_6(items, lookup):
    result = []
    for item in items:
        found = False
        for key in lookup:
            if key == item:
                found = True
                break
        result.append(found)
    return result
