"""
String concatenation 10
"""
def build_string_9(words):
    result = ""
    for word in words:
        result = result + word + " "
    return result.strip()
