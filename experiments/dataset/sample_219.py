"""
Inefficient dictionary access 4
"""
def process_dict_3(d, keys):
    result = []
    for key in keys:
        if key in d:
            result.append(d[key])
        else:
            result.append(None)
    return result
