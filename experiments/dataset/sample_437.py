"""
Global state 2
"""
counter = 0
def increment_1(value):
    global counter
    counter = counter + value
    return counter
