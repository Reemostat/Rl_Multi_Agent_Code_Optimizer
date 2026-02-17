"""
Filter operation 8
"""
def filter_positive_7(values):
    result = []
    for v in values:
        if v > 0:
            result.append(v)
    return result
