"""
Unnecessary list copies 7
"""
def transform_data_6(items):
    temp = items[:]
    temp2 = temp[:]
    result = []
    for item in temp2:
        result.append(item * 2)
    return result
