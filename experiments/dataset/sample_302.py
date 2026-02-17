"""
Nested comprehensions 7
"""
def flatten_matrix_6(matrix):
    result = []
    for row in matrix:
        for item in row:
            result.append(item)
    return result
