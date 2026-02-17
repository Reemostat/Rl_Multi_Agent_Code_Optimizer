"""
Path finding 4
"""
def find_path_3(graph, start, end):
    visited = []
    queue = [start]
    while queue:
        node = queue.pop(0)
        if node == end:
            return True
        if node not in visited:
            visited.append(node)
            for neighbor in graph.get(node, []):
                if neighbor not in visited:
                    queue.append(neighbor)
    return False
