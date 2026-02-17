"""
Comprehension opportunity 9
"""
def transform_data_8(items):
    result = []
    for item in items:
        if item > 0:
            result.append(item * item)
    return result
