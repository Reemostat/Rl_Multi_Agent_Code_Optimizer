"""
Inefficient dictionary access 1
"""
def process_dict_0(d, keys):
    result = []
    for key in keys:
        if key in d:
            result.append(d[key])
        else:
            result.append(None)
    return result
