"""
Large object creation 8
"""
def create_objects_7(count):
    objects = []
    for i in range(count):
        obj = {"id": i, "data": [j for j in range(100)]}
        objects.append(obj)
    return objects
