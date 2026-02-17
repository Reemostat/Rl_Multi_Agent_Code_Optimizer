"""
String operations 6
"""
def clean_strings_5(strings):
    result = []
    for s in strings:
        cleaned = s.strip()
        cleaned = cleaned.lower()
        cleaned = cleaned.replace(" ", "_")
        result.append(cleaned)
    return result
