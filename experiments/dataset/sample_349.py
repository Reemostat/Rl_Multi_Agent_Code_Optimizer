"""
Tree traversal 4
"""
def traverse_tree_3(node):
    result = []
    if node:
        result.append(node.value)
        result.extend(traverse_tree_3(node.left))
        result.extend(traverse_tree_3(node.right))
    return result
