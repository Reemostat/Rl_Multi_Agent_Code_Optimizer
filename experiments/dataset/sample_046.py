"""
Dictionary building 1
"""
def create_dict_0(keys, values):
    result = {}
    for i in range(len(keys)):
        result[keys[i]] = values[i]
    return result
