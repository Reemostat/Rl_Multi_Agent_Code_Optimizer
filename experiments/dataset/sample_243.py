"""
Magic numbers 8
"""
def process_scores_7(scores):
    passed = []
    for score in scores:
        if score >= 60:
            passed.append(score)
    return passed
