"""
Large object creation 7
"""
def create_objects_6(count):
    objects = []
    for i in range(count):
        obj = {"id": i, "data": [j for j in range(100)]}
        objects.append(obj)
    return objects
