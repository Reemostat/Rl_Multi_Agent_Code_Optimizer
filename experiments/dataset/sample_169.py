"""
Inefficient sorting 4
"""
def sort_list_3(items):
    result = []
    remaining = items[:]
    while remaining:
        min_val = remaining[0]
        for item in remaining:
            if item < min_val:
                min_val = item
        result.append(min_val)
        remaining.remove(min_val)
    return result
