"""
Repeated string operations 1
"""
def format_strings_0(templates, values):
    result = []
    for template in templates:
        formatted = template
        for key, val in values.items():
            formatted = formatted.replace(" + key + ", str(val))
        result.append(formatted)
    return result
