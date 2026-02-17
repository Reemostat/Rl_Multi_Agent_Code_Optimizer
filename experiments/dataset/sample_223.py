"""
Inefficient dictionary access 8
"""
def process_dict_7(d, keys):
    result = []
    for key in keys:
        if key in d:
            result.append(d[key])
        else:
            result.append(None)
    return result
