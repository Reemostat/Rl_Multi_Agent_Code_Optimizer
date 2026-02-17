"""
Global state 5
"""
counter = 0
def increment_4(value):
    global counter
    counter = counter + value
    return counter
