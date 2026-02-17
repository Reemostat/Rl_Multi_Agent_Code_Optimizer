"""
Dictionary building 2
"""
def create_dict_1(keys, values):
    result = {}
    for i in range(len(keys)):
        result[keys[i]] = values[i]
    return result
