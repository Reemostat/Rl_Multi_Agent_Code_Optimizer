"""
Nested comprehensions 4
"""
def flatten_matrix_3(matrix):
    result = []
    for row in matrix:
        for item in row:
            result.append(item)
    return result
