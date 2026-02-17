"""
Generator pattern 9
"""
def generate_numbers_8(n):
    result = []
    for i in range(n):
        result.append(i * i * i)
    return result
