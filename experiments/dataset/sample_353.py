"""
Tree traversal 8
"""
def traverse_tree_7(node):
    result = []
    if node:
        result.append(node.value)
        result.extend(traverse_tree_7(node.left))
        result.extend(traverse_tree_7(node.right))
    return result
