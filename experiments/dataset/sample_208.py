"""
Multiple passes 3
"""
def analyze_data_2(data):
    max_val = data[0]
    for item in data:
        if item > max_val:
            max_val = item
    
    min_val = data[0]
    for item in data:
        if item < min_val:
            min_val = item
    
    return max_val - min_val
