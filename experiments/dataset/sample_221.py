"""
Inefficient dictionary access 6
"""
def process_dict_5(d, keys):
    result = []
    for key in keys:
        if key in d:
            result.append(d[key])
        else:
            result.append(None)
    return result
