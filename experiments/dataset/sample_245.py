"""
Magic numbers 10
"""
def process_scores_9(scores):
    passed = []
    for score in scores:
        if score >= 60:
            passed.append(score)
    return passed
