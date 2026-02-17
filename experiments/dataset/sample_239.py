"""
Magic numbers 4
"""
def process_scores_3(scores):
    passed = []
    for score in scores:
        if score >= 60:
            passed.append(score)
    return passed
