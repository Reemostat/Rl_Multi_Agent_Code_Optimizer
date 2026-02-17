"""
Magic numbers 2
"""
def process_scores_1(scores):
    passed = []
    for score in scores:
        if score >= 60:
            passed.append(score)
    return passed
