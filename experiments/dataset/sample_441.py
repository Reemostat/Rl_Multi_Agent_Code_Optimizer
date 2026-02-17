"""
Global state 6
"""
counter = 0
def increment_5(value):
    global counter
    counter = counter + value
    return counter
