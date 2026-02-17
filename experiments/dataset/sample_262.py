"""
Generator pattern 7
"""
def generate_numbers_6(n):
    result = []
    for i in range(n):
        result.append(i * i * i)
    return result
