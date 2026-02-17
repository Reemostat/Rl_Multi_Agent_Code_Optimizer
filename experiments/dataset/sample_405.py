"""
Repeated string operations 10
"""
def format_strings_9(templates, values):
    result = []
    for template in templates:
        formatted = template
        for key, val in values.items():
            formatted = formatted.replace(" + key + ", str(val))
        result.append(formatted)
    return result
