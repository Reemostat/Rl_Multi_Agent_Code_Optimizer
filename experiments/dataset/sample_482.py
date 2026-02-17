"""
Configuration parsing 7
"""
def parse_config_6(config_lines):
    config = {}
    for line in config_lines:
        if "=" in line:
            parts = line.split("=")
            if len(parts) == 2:
                key = parts[0].strip()
                value = parts[1].strip()
                config[key] = value
    return config
