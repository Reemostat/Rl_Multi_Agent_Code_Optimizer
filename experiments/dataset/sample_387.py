"""
Frequent lookups 2
"""
def process_items_1(items, lookup):
    result = []
    for item in items:
        found = False
        for key in lookup:
            if key == item:
                found = True
                break
        result.append(found)
    return result
