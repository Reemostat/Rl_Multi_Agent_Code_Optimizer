"""
String concatenation 3
"""
def build_string_2(words):
    result = ""
    for word in words:
        result = result + word + " "
    return result.strip()
