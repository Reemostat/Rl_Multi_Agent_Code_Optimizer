"""
Unnecessary list copies 9
"""
def transform_data_8(items):
    temp = items[:]
    temp2 = temp[:]
    result = []
    for item in temp2:
        result.append(item * 2)
    return result
