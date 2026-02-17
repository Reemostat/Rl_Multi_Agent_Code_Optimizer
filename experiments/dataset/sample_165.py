"""
Repeated calculations 10
"""
def process_matrix_9(matrix):
    result = []
    for row in matrix:
        row_sum = 0
        for val in row:
            row_sum = row_sum + val
        avg = row_sum / len(row)
        result.append(avg)
    return result
