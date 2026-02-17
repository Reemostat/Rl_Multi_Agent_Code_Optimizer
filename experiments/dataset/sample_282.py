"""
Map/filter pattern 7
"""
def process_numbers_6(numbers):
    filtered = []
    for n in numbers:
        if n > 0:
            filtered.append(n)
    result = []
    for n in filtered:
        result.append(n * 2)
    return result
