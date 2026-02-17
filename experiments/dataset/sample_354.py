"""
Tree traversal 9
"""
def traverse_tree_8(node):
    result = []
    if node:
        result.append(node.value)
        result.extend(traverse_tree_8(node.left))
        result.extend(traverse_tree_8(node.right))
    return result
