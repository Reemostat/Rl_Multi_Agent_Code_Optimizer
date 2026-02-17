"""Code sanitization utilities."""

import ast
import re

DANGEROUS_IMPORTS = [
    'os', 'sys', 'subprocess', 'shutil', 'pickle', 'marshal',
    'eval', 'exec', 'compile', '__import__', 'open', 'file',
    'socket', 'urllib', 'requests', 'http', 'ftplib',
    'multiprocessing', 'threading', 'ctypes', 'cffi',
]

ALLOWED_IMPORTS = [
    'math', 'random', 'collections', 'itertools', 'functools',
    'operator', 'string', 'datetime', 'time', 'json',
    'numpy', 'pandas', 'typing', 'dataclasses',
]

def sanitize_code(code: str) -> tuple[str, list[str]]:
    """
    Sanitize code by removing dangerous imports and operations.
    Returns (sanitized_code, warnings).
    """
    warnings = []
    
    if not code or not code.strip():
        return "", ["Code is empty"]
    
    original_code = code
    
    try:
        tree = ast.parse(code)
    except SyntaxError as e:
        # Return original code if syntax error, but with warning
        warnings.append(f"Syntax error detected: {e}")
        # Try to return the code anyway - let execution handle syntax errors
        return code.strip(), warnings
    
    # Track if we removed dangerous imports
    removed_imports = []
    
    # Check for dangerous imports
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                if alias.name in DANGEROUS_IMPORTS:
                    removed_imports.append(alias.name)
                    warnings.append(f"Removed dangerous import: {alias.name}")
                    # Remove the import line
                    code = re.sub(
                        rf'^\s*import\s+{re.escape(alias.name)}\s*$',
                        '',
                        code,
                        flags=re.MULTILINE
                    )
                    code = re.sub(
                        rf'^\s*from\s+{re.escape(alias.name)}\s+import.*$',
                        '',
                        code,
                        flags=re.MULTILINE
                    )
        
        if isinstance(node, ast.ImportFrom):
            if node.module and node.module.split('.')[0] in DANGEROUS_IMPORTS:
                removed_imports.append(node.module)
                warnings.append(f"Removed dangerous import: {node.module}")
                code = re.sub(
                    rf'^\s*from\s+{re.escape(node.module)}\s+import.*$',
                    '',
                    code,
                    flags=re.MULTILINE
                )
        
        # Check for dangerous function calls
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name):
                if node.func.id in ['eval', 'exec', 'compile', '__import__']:
                    warnings.append(f"Removed dangerous call: {node.func.id}")
                    # Replace with pass
                    code = code.replace(
                        ast.get_source_segment(code, node) or '',
                        'pass'
                    )
    
    # Remove empty lines and clean up
    lines = [line for line in code.split('\n') if line.strip()]
    sanitized = '\n'.join(lines)
    
    # If sanitization removed everything, return original code with warnings
    if not sanitized or not sanitized.strip():
        warnings.append("Warning: Sanitization removed all code, returning original")
        return original_code.strip(), warnings
    
    return sanitized, warnings

def validate_code_length(code: str, max_lines: int = 300) -> tuple[bool, str]:
    """Validate code length."""
    lines = code.split('\n')
    if len(lines) > max_lines:
        return False, f"Code exceeds maximum length of {max_lines} lines"
    return True, ""

