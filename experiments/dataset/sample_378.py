"""
String building 3
"""
def build_large_string_2(parts):
    result = ""
    for part in parts:
        result = result + str(part) + ","
    return result
