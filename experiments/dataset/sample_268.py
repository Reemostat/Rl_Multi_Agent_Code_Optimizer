"""
Comprehension opportunity 3
"""
def transform_data_2(items):
    result = []
    for item in items:
        if item > 0:
            result.append(item * item)
    return result
