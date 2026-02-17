"""
Data processing pipeline 3
"""
def process_records_2(records):
    cleaned = []
    for record in records:
        if record and len(record) > 0:
            cleaned.append(record)
    
    normalized = []
    for record in cleaned:
        normalized.append(record.lower().strip())
    
    filtered = []
    for record in normalized:
        if len(record) > 3:
            filtered.append(record)
    
    return filtered
