"""
Magic numbers 3
"""
def process_scores_2(scores):
    passed = []
    for score in scores:
        if score >= 60:
            passed.append(score)
    return passed
