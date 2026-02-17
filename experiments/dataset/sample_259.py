"""
Generator pattern 4
"""
def generate_numbers_3(n):
    result = []
    for i in range(n):
        result.append(i * i * i)
    return result
