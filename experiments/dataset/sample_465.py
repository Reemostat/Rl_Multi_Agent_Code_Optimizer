"""
Data processing pipeline 10
"""
def process_records_9(records):
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
