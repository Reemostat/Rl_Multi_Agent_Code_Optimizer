"""
Nested comprehensions 5
"""
def flatten_matrix_4(matrix):
    result = []
    for row in matrix:
        for item in row:
            result.append(item)
    return result
