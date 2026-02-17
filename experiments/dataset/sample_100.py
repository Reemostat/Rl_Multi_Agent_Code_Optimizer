"""
Memory-heavy nested structures 5
"""
def create_nested_4(size):
    result = []
    for i in range(size):
        inner = []
        for j in range(size):
            inner.append(i * j)
        result.append(inner)
    return result
