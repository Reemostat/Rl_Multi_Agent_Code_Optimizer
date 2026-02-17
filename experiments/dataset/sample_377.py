"""
String building 2
"""
def build_large_string_1(parts):
    result = ""
    for part in parts:
        result = result + str(part) + ","
    return result
