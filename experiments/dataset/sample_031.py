"""
Filter operation 6
"""
def filter_positive_5(values):
    result = []
    for v in values:
        if v > 0:
            result.append(v)
    return result
