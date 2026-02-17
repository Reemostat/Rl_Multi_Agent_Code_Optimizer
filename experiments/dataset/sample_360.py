"""
Large object creation 5
"""
def create_objects_4(count):
    objects = []
    for i in range(count):
        obj = {"id": i, "data": [j for j in range(100)]}
        objects.append(obj)
    return objects
