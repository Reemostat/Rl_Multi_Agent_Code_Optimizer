"""
Memory-heavy nested structures 4
"""
def create_nested_3(size):
    result = []
    for i in range(size):
        inner = []
        for j in range(size):
            inner.append(i * j)
        result.append(inner)
    return result
