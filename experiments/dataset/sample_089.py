"""
Unnecessary list copies 4
"""
def transform_data_3(items):
    temp = items[:]
    temp2 = temp[:]
    result = []
    for item in temp2:
        result.append(item * 2)
    return result
