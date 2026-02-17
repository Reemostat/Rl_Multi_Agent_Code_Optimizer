"""
Comprehension opportunity 7
"""
def transform_data_6(items):
    result = []
    for item in items:
        if item > 0:
            result.append(item * item)
    return result
