"""
List membership check 3
"""
def check_membership_2(items, target):
    for item in items:
        if item == target:
            return True
    return False
