"""
Data validation 7
"""
def validate_input_6(data):
    if not isinstance(data, list):
        return False
    if len(data) == 0:
        return False
    for item in data:
        if not isinstance(item, int):
            return False
        if item < 0:
            return False
        if item > 1000:
            return False
    return True
