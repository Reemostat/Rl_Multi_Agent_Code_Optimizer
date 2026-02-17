"""
API response processing 2
"""
def extract_data_1(responses):
    results = []
    for response in responses:
        if "data" in response:
            data = response["data"]
            if "items" in data:
                items = data["items"]
                for item in items:
                    if "value" in item:
                        results.append(item["value"])
    return results
