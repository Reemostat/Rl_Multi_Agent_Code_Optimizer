"""
Filter operation 5
"""
def filter_positive_4(values):
    result = []
    for v in values:
        if v > 0:
            result.append(v)
    return result
