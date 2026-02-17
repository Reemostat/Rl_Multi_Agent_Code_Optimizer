"""
Matrix multiplication 3
"""
def multiply_matrices_2(a, b):
    result = []
    for i in range(len(a)):
        row = []
        for j in range(len(b[0])):
            sum_val = 0
            for k in range(len(b)):
                sum_val = sum_val + a[i][k] * b[k][j]
            row.append(sum_val)
        result.append(row)
    return result
