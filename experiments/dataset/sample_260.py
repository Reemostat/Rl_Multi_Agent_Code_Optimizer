"""
Generator pattern 5
"""
def generate_numbers_4(n):
    result = []
    for i in range(n):
        result.append(i * i * i)
    return result
