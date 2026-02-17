"""
Tree traversal 5
"""
def traverse_tree_4(node):
    result = []
    if node:
        result.append(node.value)
        result.extend(traverse_tree_4(node.left))
        result.extend(traverse_tree_4(node.right))
    return result
