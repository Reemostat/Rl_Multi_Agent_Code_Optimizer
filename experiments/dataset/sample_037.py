"""
String concatenation 2
"""
def build_string_1(words):
    result = ""
    for word in words:
        result = result + word + " "
    return result.strip()
