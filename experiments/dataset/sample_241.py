"""
Magic numbers 6
"""
def process_scores_5(scores):
    passed = []
    for score in scores:
        if score >= 60:
            passed.append(score)
    return passed
