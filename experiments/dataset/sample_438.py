"""
Global state 3
"""
counter = 0
def increment_2(value):
    global counter
    counter = counter + value
    return counter
