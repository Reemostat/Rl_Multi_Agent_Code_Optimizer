"""
Long function 5
"""
def complex_function_4(data):
    result = []
    for item in data:
        if item > 0:
            if item < 100:
                if item % 2 == 0:
                    if item % 3 == 0:
                        result.append(item)
    return result
