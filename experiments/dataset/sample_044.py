"""
String concatenation 9
"""
def build_string_8(words):
    result = ""
    for word in words:
        result = result + word + " "
    return result.strip()
