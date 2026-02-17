"""
Generator pattern 2
"""
def generate_numbers_1(n):
    result = []
    for i in range(n):
        result.append(i * i * i)
    return result
