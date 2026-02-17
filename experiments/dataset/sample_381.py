"""
String building 6
"""
def build_large_string_5(parts):
    result = ""
    for part in parts:
        result = result + str(part) + ","
    return result
