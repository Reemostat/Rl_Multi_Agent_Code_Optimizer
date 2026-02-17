"""
String operations 4
"""
def clean_strings_3(strings):
    result = []
    for s in strings:
        cleaned = s.strip()
        cleaned = cleaned.lower()
        cleaned = cleaned.replace(" ", "_")
        result.append(cleaned)
    return result
