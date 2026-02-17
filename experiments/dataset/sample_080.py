"""
Inefficient string operations 5
"""
def manipulate_strings_4(texts):
    result = []
    for text in texts:
        new_text = text.upper()
        new_text = new_text.lower()
        new_text = new_text.strip()
        result.append(new_text)
    return result
