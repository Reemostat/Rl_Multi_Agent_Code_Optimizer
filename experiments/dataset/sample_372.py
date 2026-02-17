"""
Deep copying 7
"""
def process_nested_6(data):
    copy1 = [row[:] for row in data]
    copy2 = [row[:] for row in copy1]
    result = []
    for row in copy2:
        result.append(sum(row))
    return result
