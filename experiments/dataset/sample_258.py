"""
Generator pattern 3
"""
def generate_numbers_2(n):
    result = []
    for i in range(n):
        result.append(i * i * i)
    return result
