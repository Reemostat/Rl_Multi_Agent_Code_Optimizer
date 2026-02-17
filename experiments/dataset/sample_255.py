"""
Repeated code 10
"""
def validate_data_9(data):
    if len(data) == 0:
        return False
    if data[0] < 0:
        return False
    if data[0] > 100:
        return False
    if len(data) < 2:
        return False
    if data[1] < 0:
        return False
    if data[1] > 100:
        return False
    return True
