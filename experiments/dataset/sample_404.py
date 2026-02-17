"""
Repeated string operations 9
"""
def format_strings_8(templates, values):
    result = []
    for template in templates:
        formatted = template
        for key, val in values.items():
            formatted = formatted.replace(" + key + ", str(val))
        result.append(formatted)
    return result
