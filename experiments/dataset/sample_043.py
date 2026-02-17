"""
String concatenation 8
"""
def build_string_7(words):
    result = ""
    for word in words:
        result = result + word + " "
    return result.strip()
