"""
Nested comprehensions 9
"""
def flatten_matrix_8(matrix):
    result = []
    for row in matrix:
        for item in row:
            result.append(item)
    return result
