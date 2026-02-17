"""
Global state 8
"""
counter = 0
def increment_7(value):
    global counter
    counter = counter + value
    return counter
