"""
Dictionary building 4
"""
def create_dict_3(keys, values):
    result = {}
    for i in range(len(keys)):
        result[keys[i]] = values[i]
    return result
