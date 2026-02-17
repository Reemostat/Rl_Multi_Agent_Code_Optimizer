"""
Global state 4
"""
counter = 0
def increment_3(value):
    global counter
    counter = counter + value
    return counter
