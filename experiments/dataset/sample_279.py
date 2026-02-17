"""
Map/filter pattern 4
"""
def process_numbers_3(numbers):
    filtered = []
    for n in numbers:
        if n > 0:
            filtered.append(n)
    result = []
    for n in filtered:
        result.append(n * 2)
    return result
