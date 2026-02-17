"""
Nested comprehensions 3
"""
def flatten_matrix_2(matrix):
    result = []
    for row in matrix:
        for item in row:
            result.append(item)
    return result
