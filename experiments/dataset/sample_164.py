"""
Repeated calculations 9
"""
def process_matrix_8(matrix):
    result = []
    for row in matrix:
        row_sum = 0
        for val in row:
            row_sum = row_sum + val
        avg = row_sum / len(row)
        result.append(avg)
    return result
