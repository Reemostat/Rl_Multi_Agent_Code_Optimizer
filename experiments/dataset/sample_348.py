"""
Tree traversal 3
"""
def traverse_tree_2(node):
    result = []
    if node:
        result.append(node.value)
        result.extend(traverse_tree_2(node.left))
        result.extend(traverse_tree_2(node.right))
    return result
