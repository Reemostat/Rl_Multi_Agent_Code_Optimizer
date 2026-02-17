"""
Magic numbers 9
"""
def process_scores_8(scores):
    passed = []
    for score in scores:
        if score >= 60:
            passed.append(score)
    return passed
