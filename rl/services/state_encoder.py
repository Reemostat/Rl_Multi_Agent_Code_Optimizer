"""
State encoder for RL observations.
Extracts 32-dimensional feature vector from code.
"""

import ast
import numpy as np
from typing import Optional

# Optional dependencies with fallbacks
try:
    import radon.complexity as radon_cc
    HAS_RADON = True
except ImportError:
    HAS_RADON = False
    radon_cc = None

try:
    from sentence_transformers import SentenceTransformer
    HAS_SENTENCE_TRANSFORMERS = True
except ImportError:
    HAS_SENTENCE_TRANSFORMERS = False
    SentenceTransformer = None

# Load embedding model (cached after first load)
_embedding_model = None

def get_embedding_model():
    """Lazy load embedding model."""
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    return _embedding_model

def encode_state(code: str, baseline_runtime: float, baseline_memory: float) -> np.ndarray:
    """
    Encode code state into 64-dimensional observation vector (expanded from 32).
    
    Features:
    0: lines_of_code (normalized)
    1: cyclomatic_complexity (normalized)
    2: nested_loop_depth
    3: recursion_flag
    4-13: AST node counts (10 types)
    14: baseline_runtime (normalized)
    15: baseline_memory (normalized)
    16: lint_score (0-1)
    17: test_pass_ratio (0-1)
    18: iteration_count (normalized)
    19-31: embedding similarity features (13 dims)
    32-35: Additional AST metrics (function count, class count, import count, decorator count)
    36-39: Code style metrics (avg line length, max line length, comment ratio, docstring ratio)
    40-43: Structural metrics (max function length, avg function length, max nesting, avg nesting)
    44-47: Performance prediction (estimated complexity, estimated runtime, estimated memory, code size)
    48-51: Pattern detection (has list comprehension, has generator, has lambda, has decorator)
    52-55: Control flow (if_count, for_count, while_count, try_count)
    56-59: Data structures (list_ops, dict_ops, set_ops, tuple_ops)
    60-63: Code quality proxies (readability score, maintainability index, code density, abstraction level)
    """
    features = np.zeros(64, dtype=np.float32)
    
    if not code or len(code.strip()) == 0:
        return features
    
    try:
        # Parse AST
        tree = ast.parse(code)
        
        # Feature 0: Lines of code (normalized by 1000)
        lines = len(code.split('\n'))
        features[0] = min(lines / 1000.0, 1.0)
        
        # Feature 1: Cyclomatic complexity (normalized by 50)
        if HAS_RADON:
            try:
                cc = radon_cc.cc_visit(code)
                if isinstance(cc, list) and len(cc) > 0:
                    max_cc = max(c.complexity for c in cc)
                    features[1] = min(max_cc / 50.0, 1.0)
            except:
                features[1] = 0.0
        else:
            features[1] = 0.0  # Fallback if radon not available
        
        # Feature 2: Nested loop depth
        features[2] = _get_max_nested_depth(tree) / 10.0
        
        # Feature 3: Recursion flag
        features[3] = 1.0 if _has_recursion(tree) else 0.0
        
        # Features 4-13: AST node type counts
        node_counts = _count_ast_nodes(tree)
        for i, count in enumerate(node_counts[:10]):
            features[4 + i] = min(count / 100.0, 1.0)
        
        # Feature 14: Baseline runtime (normalized by 10s)
        features[14] = min(baseline_runtime / 10.0, 1.0)
        
        # Feature 15: Baseline memory (normalized by 100MB)
        features[15] = min(baseline_memory / 100.0, 1.0)
        
        # Feature 16: Lint score (placeholder - would use ruff)
        features[16] = 0.8  # Placeholder
        
        # Feature 17: Test pass ratio (placeholder)
        features[17] = 1.0  # Placeholder
        
        # Feature 18: Iteration count (count loops)
        features[18] = min(_count_iterations(tree) / 50.0, 1.0)
        
        # Features 19-31: Embedding features (simplified - use code length, complexity, etc. as proxy)
        embedding_proxy = _get_embedding_proxy(code, tree)
        for i, val in enumerate(embedding_proxy[:13]):
            features[19 + i] = val
        
        # Features 32-35: Additional AST metrics
        functions = [n for n in ast.walk(tree) if isinstance(n, ast.FunctionDef)]
        classes = [n for n in ast.walk(tree) if isinstance(n, ast.ClassDef)]
        imports = [n for n in ast.walk(tree) if isinstance(n, (ast.Import, ast.ImportFrom))]
        decorators = [n for n in ast.walk(tree) if isinstance(n, ast.decorator_list) and len(n) > 0]
        
        features[32] = min(len(functions) / 50.0, 1.0)  # Function count
        features[33] = min(len(classes) / 20.0, 1.0)  # Class count
        features[34] = min(len(imports) / 20.0, 1.0)  # Import count
        features[35] = min(len(decorators) / 10.0, 1.0)  # Decorator count
        
        # Features 36-39: Code style metrics
        code_lines = code.split('\n')
        line_lengths = [len(line) for line in code_lines if line.strip()]
        avg_line_length = sum(line_lengths) / max(len(line_lengths), 1)
        max_line_length = max(line_lengths) if line_lengths else 0
        comment_lines = sum(1 for line in code_lines if line.strip().startswith('#'))
        docstring_lines = sum(1 for node in ast.walk(tree) if isinstance(node, (ast.FunctionDef, ast.ClassDef)) and ast.get_docstring(node))
        
        features[36] = min(avg_line_length / 100.0, 1.0)  # Avg line length
        features[37] = min(max_line_length / 200.0, 1.0)  # Max line length
        features[38] = min(comment_lines / max(lines, 1), 1.0)  # Comment ratio
        features[39] = min(docstring_lines / max(len(functions) + len(classes), 1), 1.0)  # Docstring ratio
        
        # Features 40-43: Structural metrics
        func_lengths = [len(ast.unparse(f).split('\n')) if hasattr(ast, 'unparse') else 10 for f in functions]
        max_func_length = max(func_lengths) if func_lengths else 0
        avg_func_length = sum(func_lengths) / max(len(func_lengths), 1)
        max_nesting = _get_max_nested_depth(tree)
        avg_nesting = _calculate_avg_nesting(tree)
        
        features[40] = min(max_func_length / 200.0, 1.0)  # Max function length
        features[41] = min(avg_func_length / 100.0, 1.0)  # Avg function length
        features[42] = min(max_nesting / 10.0, 1.0)  # Max nesting
        features[43] = min(avg_nesting / 5.0, 1.0)  # Avg nesting
        
        # Features 44-47: Performance prediction
        estimated_complexity = features[1] * features[2]  # Complexity * nesting
        estimated_runtime = features[0] * features[1]  # Lines * complexity
        estimated_memory = features[0] * features[18]  # Lines * iterations
        code_size = len(code)
        
        features[44] = min(estimated_complexity, 1.0)
        features[45] = min(estimated_runtime, 1.0)
        features[46] = min(estimated_memory, 1.0)
        features[47] = min(code_size / 10000.0, 1.0)  # Code size
        
        # Features 48-51: Pattern detection
        features[48] = 1.0 if any(isinstance(n, ast.ListComp) for n in ast.walk(tree)) else 0.0  # List comprehension
        features[49] = 1.0 if any(isinstance(n, ast.GeneratorExp) for n in ast.walk(tree)) else 0.0  # Generator
        features[50] = 1.0 if any(isinstance(n, ast.Lambda) for n in ast.walk(tree)) else 0.0  # Lambda
        features[51] = 1.0 if features[35] > 0 else 0.0  # Has decorators
        
        # Features 52-55: Control flow
        if_count = len([n for n in ast.walk(tree) if isinstance(n, ast.If)])
        for_count = len([n for n in ast.walk(tree) if isinstance(n, ast.For)])
        while_count = len([n for n in ast.walk(tree) if isinstance(n, ast.While)])
        try_count = len([n for n in ast.walk(tree) if isinstance(n, ast.Try)])
        
        features[52] = min(if_count / 50.0, 1.0)
        features[53] = min(for_count / 50.0, 1.0)
        features[54] = min(while_count / 20.0, 1.0)
        features[55] = min(try_count / 10.0, 1.0)
        
        # Features 56-59: Data structure operations
        list_ops = len([n for n in ast.walk(tree) if isinstance(n, ast.List)])
        dict_ops = len([n for n in ast.walk(tree) if isinstance(n, ast.Dict)])
        set_ops = len([n for n in ast.walk(tree) if isinstance(n, ast.Set)])
        tuple_ops = len([n for n in ast.walk(tree) if isinstance(n, ast.Tuple)])
        
        features[56] = min(list_ops / 50.0, 1.0)
        features[57] = min(dict_ops / 50.0, 1.0)
        features[58] = min(set_ops / 20.0, 1.0)
        features[59] = min(tuple_ops / 20.0, 1.0)
        
        # Features 60-63: Code quality proxies
        readability_score = 1.0 - min(features[1] * 0.3 + features[2] * 0.2, 1.0)  # Inverse of complexity
        maintainability = 1.0 - min(features[0] * 0.1 + features[40] * 0.2, 1.0)  # Inverse of size/complexity
        code_density = features[0] / max(code_size / 1000.0, 1.0)  # Lines per 1K chars
        abstraction_level = min((features[32] + features[33]) / 10.0, 1.0)  # Functions + classes
        
        features[60] = readability_score
        features[61] = maintainability
        features[62] = min(code_density, 1.0)
        features[63] = abstraction_level
        
    except SyntaxError:
        # Invalid code - return zero vector
        pass
    except Exception:
        # Error in encoding - return partial features
        pass
    
    return features

def _get_max_nested_depth(node: ast.AST, depth: int = 0) -> int:
    """Get maximum nesting depth of loops/conditionals."""
    max_depth = depth
    
    if isinstance(node, (ast.For, ast.While, ast.If, ast.With)):
        max_depth = depth + 1
    
    for child in ast.iter_child_nodes(node):
        child_depth = _get_max_nested_depth(child, depth + (1 if isinstance(node, (ast.For, ast.While, ast.If)) else 0))
        max_depth = max(max_depth, child_depth)
    
    return max_depth

def _has_recursion(tree: ast.AST) -> bool:
    """Check if code contains recursive function calls."""
    function_names = set()
    calls = []
    
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            function_names.add(node.name)
        elif isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name):
                calls.append(node.func.id)
    
    # Check if any function calls itself
    return any(call in function_names for call in calls)

def _count_ast_nodes(tree: ast.AST) -> list:
    """Count different AST node types."""
    node_types = [
        ast.FunctionDef, ast.For, ast.While, ast.If, ast.List,
        ast.Dict, ast.Set, ast.Tuple, ast.Call, ast.BinOp
    ]
    counts = [0] * len(node_types)
    
    for node in ast.walk(tree):
        for i, node_type in enumerate(node_types):
            if isinstance(node, node_type):
                counts[i] += 1
    
    return counts

def _count_iterations(tree: ast.AST) -> int:
    """Count loop iterations (for/while)."""
    count = 0
    for node in ast.walk(tree):
        if isinstance(node, (ast.For, ast.While)):
            count += 1
    return count

def _get_embedding_proxy(code: str, tree: ast.AST) -> np.ndarray:
    """
    Get proxy features for embedding (simplified version).
    In full version, would compute actual sentence transformer embedding.
    """
    # Use code statistics as proxy for embedding
    proxy = np.zeros(13, dtype=np.float32)
    
    # Use various code metrics as proxy
    lines = len(code.split('\n'))
    chars = len(code)
    functions = len([n for n in ast.walk(tree) if isinstance(n, ast.FunctionDef)])
    classes = len([n for n in ast.walk(tree) if isinstance(n, ast.ClassDef)])
    imports = len([n for n in ast.walk(tree) if isinstance(n, (ast.Import, ast.ImportFrom))])
    
    proxy[0] = min(lines / 1000.0, 1.0)
    proxy[1] = min(chars / 10000.0, 1.0)
    proxy[2] = min(functions / 50.0, 1.0)
    proxy[3] = min(classes / 20.0, 1.0)
    proxy[4] = min(imports / 20.0, 1.0)
    
    # Fill rest with normalized metrics
    for i in range(5, 13):
        proxy[i] = (lines + chars + functions) / 10000.0
    
    return proxy

