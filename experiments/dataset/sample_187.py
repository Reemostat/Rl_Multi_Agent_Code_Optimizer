"""
List membership check 2
"""
def check_membership_1(items, target):
    for item in items:
        if item == target:
            return True
    return False
