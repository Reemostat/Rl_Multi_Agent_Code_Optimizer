"""
Nested comprehensions 2
"""
def flatten_matrix_1(matrix):
    result = []
    for row in matrix:
        for item in row:
            result.append(item)
    return result
