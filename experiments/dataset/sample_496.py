"""
Data validation 1
"""
def validate_input_0(data):
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
