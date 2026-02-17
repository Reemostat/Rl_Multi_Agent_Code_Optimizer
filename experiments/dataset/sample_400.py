"""
Repeated string operations 5
"""
def format_strings_4(templates, values):
    result = []
    for template in templates:
        formatted = template
        for key, val in values.items():
            formatted = formatted.replace(" + key + ", str(val))
        result.append(formatted)
    return result
