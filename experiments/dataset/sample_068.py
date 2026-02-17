"""
Duplicate data 3
"""
def process_data_2(data):
    copy1 = data[:]
    copy2 = data[:]
    copy3 = data[:]
    return [len(copy1), len(copy2), len(copy3)]
