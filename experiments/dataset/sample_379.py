"""
String building 4
"""
def build_large_string_3(parts):
    result = ""
    for part in parts:
        result = result + str(part) + ","
    return result
