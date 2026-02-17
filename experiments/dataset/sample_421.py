"""
Multiple iterations 6
"""
def analyze_list_5(items):
    positives = []
    for item in items:
        if item > 0:
            positives.append(item)
    
    evens = []
    for item in items:
        if item % 2 == 0:
            evens.append(item)
    
    large = []
    for item in items:
        if item > 50:
            large.append(item)
    
    return len(positives), len(evens), len(large)
