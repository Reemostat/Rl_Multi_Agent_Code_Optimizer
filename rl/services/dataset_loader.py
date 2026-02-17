"""
Load code samples from dataset directory for training.
"""

import random
from pathlib import Path
from typing import Optional, Tuple

_dataset_samples = None
_dataset_path = None


def load_dataset(dataset_dir: Optional[Path] = None) -> list:
    """
    Load all code samples from dataset directory.
    Returns list of (code_string, filename) tuples.
    """
    global _dataset_samples, _dataset_path
    
    if dataset_dir is None:
        dataset_dir = Path(__file__).parent.parent.parent / "experiments" / "dataset"
    
    # Cache samples if already loaded from same directory
    if _dataset_samples is not None and _dataset_path == dataset_dir:
        return _dataset_samples
    
    _dataset_path = dataset_dir
    samples = []
    
    if not dataset_dir.exists():
        print(f"Warning: Dataset directory not found: {dataset_dir}")
        return samples
    
    # Load all .py files
    for sample_file in sorted(dataset_dir.glob("sample_*.py")):
        try:
            with open(sample_file, 'r') as f:
                code = f.read().strip()
                if code:  # Only add non-empty files
                    samples.append((code, sample_file.name))
        except Exception as e:
            print(f"Warning: Failed to load {sample_file}: {e}")
    
    _dataset_samples = samples
    print(f"Loaded {len(samples)} code samples from {dataset_dir}")
    return samples


def get_random_sample() -> Tuple[str, float, float]:
    """
    Get a random code sample with simulated baseline metrics.
    Returns: (code, baseline_runtime, baseline_memory)
    """
    samples = load_dataset()
    
    if not samples:
        # Fallback: return empty code with default metrics
        return "", 1.0, 1.0
    
    # Pick random sample
    code, _ = random.choice(samples)
    
    # Simulate baseline metrics based on code characteristics
    lines = len(code.split('\n'))
    chars = len(code)
    
    # Simulate runtime (milliseconds) - more code = more runtime
    baseline_runtime = 0.001 + (lines * 0.0001) + (chars * 0.00001)
    baseline_runtime = min(baseline_runtime, 1.0)  # Cap at 1 second
    
    # Simulate memory (MB) - more code = more memory
    baseline_memory = 0.1 + (lines * 0.01) + (chars * 0.001)
    baseline_memory = min(baseline_memory, 10.0)  # Cap at 10 MB
    
    return code, baseline_runtime, baseline_memory


def get_sample_by_index(index: int) -> Tuple[str, float, float]:
    """Get a specific sample by index."""
    samples = load_dataset()
    
    if not samples or index >= len(samples):
        return "", 1.0, 1.0
    
    code, _ = samples[index]
    lines = len(code.split('\n'))
    chars = len(code)
    
    baseline_runtime = 0.001 + (lines * 0.0001) + (chars * 0.00001)
    baseline_runtime = min(baseline_runtime, 1.0)
    
    baseline_memory = 0.1 + (lines * 0.01) + (chars * 0.001)
    baseline_memory = min(baseline_memory, 10.0)
    
    return code, baseline_runtime, baseline_memory

