"""
Filter operation 2
"""
def filter_positive_1(values):
    result = []
    for v in values:
        if v > 0:
            result.append(v)
    return result
