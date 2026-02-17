"""
Comprehension opportunity 8
"""
def transform_data_7(items):
    result = []
    for item in items:
        if item > 0:
            result.append(item * item)
    return result
