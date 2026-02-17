"""
Tree traversal 7
"""
def traverse_tree_6(node):
    result = []
    if node:
        result.append(node.value)
        result.extend(traverse_tree_6(node.left))
        result.extend(traverse_tree_6(node.right))
    return result
