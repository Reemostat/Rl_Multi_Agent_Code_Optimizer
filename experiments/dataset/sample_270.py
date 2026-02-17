"""
Comprehension opportunity 5
"""
def transform_data_4(items):
    result = []
    for item in items:
        if item > 0:
            result.append(item * item)
    return result
