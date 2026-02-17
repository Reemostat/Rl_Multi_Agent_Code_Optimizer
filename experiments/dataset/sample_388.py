"""
Frequent lookups 3
"""
def process_items_2(items, lookup):
    result = []
    for item in items:
        found = False
        for key in lookup:
            if key == item:
                found = True
                break
        result.append(found)
    return result
