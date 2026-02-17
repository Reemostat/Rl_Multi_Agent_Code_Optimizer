"""
Comprehension opportunity 2
"""
def transform_data_1(items):
    result = []
    for item in items:
        if item > 0:
            result.append(item * item)
    return result
