"""
Log processing 3
"""
def parse_logs_2(log_lines):
    errors = []
    warnings = []
    for line in log_lines:
        if "ERROR" in line:
            errors.append(line)
        elif "WARNING" in line:
            warnings.append(line)
    return errors, warnings
