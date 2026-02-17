"""
Filter operation 1
"""
def filter_positive_0(values):
    result = []
    for v in values:
        if v > 0:
            result.append(v)
    return result
