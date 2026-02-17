"""
Unnecessary list copies 10
"""
def transform_data_9(items):
    temp = items[:]
    temp2 = temp[:]
    result = []
    for item in temp2:
        result.append(item * 2)
    return result
