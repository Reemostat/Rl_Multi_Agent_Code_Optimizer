"""
String concatenation 6
"""
def build_string_5(words):
    result = ""
    for word in words:
        result = result + word + " "
    return result.strip()
