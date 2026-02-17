"""
Large object creation 3
"""
def create_objects_2(count):
    objects = []
    for i in range(count):
        obj = {"id": i, "data": [j for j in range(100)]}
        objects.append(obj)
    return objects
