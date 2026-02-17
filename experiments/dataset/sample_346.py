"""
Tree traversal 1
"""
def traverse_tree_0(node):
    result = []
    if node:
        result.append(node.value)
        result.extend(traverse_tree_0(node.left))
        result.extend(traverse_tree_0(node.right))
    return result
