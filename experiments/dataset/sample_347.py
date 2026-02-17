"""
Tree traversal 2
"""
def traverse_tree_1(node):
    result = []
    if node:
        result.append(node.value)
        result.extend(traverse_tree_1(node.left))
        result.extend(traverse_tree_1(node.right))
    return result
