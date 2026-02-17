"""
List membership check 1
"""
def check_membership_0(items, target):
    for item in items:
        if item == target:
            return True
    return False
