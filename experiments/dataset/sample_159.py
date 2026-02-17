"""
Repeated calculations 4
"""
def process_matrix_3(matrix):
    result = []
    for row in matrix:
        row_sum = 0
        for val in row:
            row_sum = row_sum + val
        avg = row_sum / len(row)
        result.append(avg)
    return result
