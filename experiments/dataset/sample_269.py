"""
Comprehension opportunity 4
"""
def transform_data_3(items):
    result = []
    for item in items:
        if item > 0:
            result.append(item * item)
    return result
