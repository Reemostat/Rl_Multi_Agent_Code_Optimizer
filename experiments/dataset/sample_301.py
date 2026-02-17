"""
Nested comprehensions 6
"""
def flatten_matrix_5(matrix):
    result = []
    for row in matrix:
        for item in row:
            result.append(item)
    return result
