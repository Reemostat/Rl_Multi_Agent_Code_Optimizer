"""
Filter operation 4
"""
def filter_positive_3(values):
    result = []
    for v in values:
        if v > 0:
            result.append(v)
    return result
