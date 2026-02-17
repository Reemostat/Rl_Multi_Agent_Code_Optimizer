"""
Tree traversal 6
"""
def traverse_tree_5(node):
    result = []
    if node:
        result.append(node.value)
        result.extend(traverse_tree_5(node.left))
        result.extend(traverse_tree_5(node.right))
    return result
