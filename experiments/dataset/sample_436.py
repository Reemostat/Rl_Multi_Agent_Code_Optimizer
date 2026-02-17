"""
Global state 1
"""
counter = 0
def increment_0(value):
    global counter
    counter = counter + value
    return counter
