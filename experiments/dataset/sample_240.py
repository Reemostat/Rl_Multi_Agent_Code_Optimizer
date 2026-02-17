"""
Magic numbers 5
"""
def process_scores_4(scores):
    passed = []
    for score in scores:
        if score >= 60:
            passed.append(score)
    return passed
