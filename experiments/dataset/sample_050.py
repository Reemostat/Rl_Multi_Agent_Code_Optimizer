"""
Dictionary building 5
"""
def create_dict_4(keys, values):
    result = {}
    for i in range(len(keys)):
        result[keys[i]] = values[i]
    return result
