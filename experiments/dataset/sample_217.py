"""
Inefficient dictionary access 2
"""
def process_dict_1(d, keys):
    result = []
    for key in keys:
        if key in d:
            result.append(d[key])
        else:
            result.append(None)
    return result
