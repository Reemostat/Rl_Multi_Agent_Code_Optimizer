"""
Comprehension opportunity 10
"""
def transform_data_9(items):
    result = []
    for item in items:
        if item > 0:
            result.append(item * item)
    return result
