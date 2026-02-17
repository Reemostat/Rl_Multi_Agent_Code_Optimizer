"""
Magic numbers 7
"""
def process_scores_6(scores):
    passed = []
    for score in scores:
        if score >= 60:
            passed.append(score)
    return passed
