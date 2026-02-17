"""
Memory-heavy nested structures 8
"""
def create_nested_7(size):
    result = []
    for i in range(size):
        inner = []
        for j in range(size):
            inner.append(i * j)
        result.append(inner)
    return result
