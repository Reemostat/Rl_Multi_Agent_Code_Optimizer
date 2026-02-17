"""
Global state 10
"""
counter = 0
def increment_9(value):
    global counter
    counter = counter + value
    return counter
