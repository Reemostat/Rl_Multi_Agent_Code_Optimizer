"""
Dictionary building 3
"""
def create_dict_2(keys, values):
    result = {}
    for i in range(len(keys)):
        result[keys[i]] = values[i]
    return result
