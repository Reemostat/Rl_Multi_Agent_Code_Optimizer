"""
Generator pattern 1
"""
def generate_numbers_0(n):
    result = []
    for i in range(n):
        result.append(i * i * i)
    return result
