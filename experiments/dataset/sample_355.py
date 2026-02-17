"""
Tree traversal 10
"""
def traverse_tree_9(node):
    result = []
    if node:
        result.append(node.value)
        result.extend(traverse_tree_9(node.left))
        result.extend(traverse_tree_9(node.right))
    return result
