"""
Inefficient string operations 6
"""
def manipulate_strings_5(texts):
    result = []
    for text in texts:
        new_text = text.upper()
        new_text = new_text.lower()
        new_text = new_text.strip()
        result.append(new_text)
    return result
