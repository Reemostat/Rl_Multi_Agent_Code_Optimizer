"""
String building 1
"""
def build_large_string_0(parts):
    result = ""
    for part in parts:
        result = result + str(part) + ","
    return result
