"""
Nested comprehensions 10
"""
def flatten_matrix_9(matrix):
    result = []
    for row in matrix:
        for item in row:
            result.append(item)
    return result
