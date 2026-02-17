"""
Nested comprehensions 8
"""
def flatten_matrix_7(matrix):
    result = []
    for row in matrix:
        for item in row:
            result.append(item)
    return result
