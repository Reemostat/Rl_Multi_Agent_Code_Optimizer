"""
String concatenation 5
"""
def build_string_4(words):
    result = ""
    for word in words:
        result = result + word + " "
    return result.strip()
