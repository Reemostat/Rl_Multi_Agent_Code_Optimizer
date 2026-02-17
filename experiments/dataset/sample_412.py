"""
Inefficient aggregation 7
"""
def aggregate_data_6(data):
    total = 0
    count = 0
    for item in data:
        total = total + item
        count = count + 1
    avg = total / count if count > 0 else 0
    
    max_val = data[0]
    for item in data:
        if item > max_val:
            max_val = item
    
    min_val = data[0]
    for item in data:
        if item < min_val:
            min_val = item
    
    return {"avg": avg, "max": max_val, "min": min_val}
