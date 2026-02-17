"""
Magic numbers 1
"""
def process_scores_0(scores):
    passed = []
    for score in scores:
        if score >= 60:
            passed.append(score)
    return passed
