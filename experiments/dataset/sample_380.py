"""
String building 5
"""
def build_large_string_4(parts):
    result = ""
    for part in parts:
        result = result + str(part) + ","
    return result
