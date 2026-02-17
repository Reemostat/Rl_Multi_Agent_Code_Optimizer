"""
Nested comprehensions 1
"""
def flatten_matrix_0(matrix):
    result = []
    for row in matrix:
        for item in row:
            result.append(item)
    return result
