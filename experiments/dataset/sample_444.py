"""
Global state 9
"""
counter = 0
def increment_8(value):
    global counter
    counter = counter + value
    return counter
