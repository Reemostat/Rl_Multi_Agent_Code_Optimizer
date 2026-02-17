"""
String concatenation 1
"""
def build_string_0(words):
    result = ""
    for word in words:
        result = result + word + " "
    return result.strip()
