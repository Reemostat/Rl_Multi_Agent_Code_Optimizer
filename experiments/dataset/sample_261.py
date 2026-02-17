"""
Generator pattern 6
"""
def generate_numbers_5(n):
    result = []
    for i in range(n):
        result.append(i * i * i)
    return result
