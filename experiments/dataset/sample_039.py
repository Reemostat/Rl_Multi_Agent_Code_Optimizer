"""
String concatenation 4
"""
def build_string_3(words):
    result = ""
    for word in words:
        result = result + word + " "
    return result.strip()
