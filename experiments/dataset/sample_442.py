"""
Global state 7
"""
counter = 0
def increment_6(value):
    global counter
    counter = counter + value
    return counter
