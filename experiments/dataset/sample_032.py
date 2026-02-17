"""
Filter operation 7
"""
def filter_positive_6(values):
    result = []
    for v in values:
        if v > 0:
            result.append(v)
    return result
