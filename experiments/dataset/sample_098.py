"""
Memory-heavy nested structures 3
"""
def create_nested_2(size):
    result = []
    for i in range(size):
        inner = []
        for j in range(size):
            inner.append(i * j)
        result.append(inner)
    return result
