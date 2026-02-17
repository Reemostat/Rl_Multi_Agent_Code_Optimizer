"""
Generate diverse code samples for RL training dataset.
Creates 300+ code samples with different complexity levels and optimization scenarios.
"""

import os
from pathlib import Path

dataset_dir = Path(__file__).parent / "dataset"
dataset_dir.mkdir(exist_ok=True)

# Template code samples with different optimization opportunities
samples = []

# ===== SIMPLE OPTIMIZATIONS (50 samples) =====

# Loop optimizations
for i in range(10):
    samples.append(f'''"""
Simple loop optimization {i+1}
"""
def process_list_{i}(items):
    result = []
    for item in items:
        result.append(item * 2)
    return result
''')

for i in range(10):
    samples.append(f'''"""
Sum calculation {i+1}
"""
def calculate_sum_{i}(numbers):
    total = 0
    for n in numbers:
        total = total + n
    return total
''')

for i in range(10):
    samples.append(f'''"""
Filter operation {i+1}
"""
def filter_positive_{i}(values):
    result = []
    for v in values:
        if v > 0:
            result.append(v)
    return result
''')

for i in range(10):
    samples.append(f'''"""
String concatenation {i+1}
"""
def build_string_{i}(words):
    result = ""
    for word in words:
        result = result + word + " "
    return result.strip()
''')

for i in range(10):
    samples.append(f'''"""
Dictionary building {i+1}
"""
def create_dict_{i}(keys, values):
    result = {{}}
    for i in range(len(keys)):
        result[keys[i]] = values[i]
    return result
''')

# ===== MEMORY OPTIMIZATIONS (50 samples) =====

for i in range(10):
    samples.append(f'''"""
Large list creation {i+1}
"""
def generate_large_list_{i}(n):
    result = []
    for i in range(n):
        result.append(i * i)
    return result
''')

for i in range(10):
    samples.append(f'''"""
Duplicate data {i+1}
"""
def process_data_{i}(data):
    copy1 = data[:]
    copy2 = data[:]
    copy3 = data[:]
    return [len(copy1), len(copy2), len(copy3)]
''')

for i in range(10):
    samples.append(f'''"""
Inefficient string operations {i+1}
"""
def manipulate_strings_{i}(texts):
    result = []
    for text in texts:
        new_text = text.upper()
        new_text = new_text.lower()
        new_text = new_text.strip()
        result.append(new_text)
    return result
''')

for i in range(10):
    samples.append(f'''"""
Unnecessary list copies {i+1}
"""
def transform_data_{i}(items):
    temp = items[:]
    temp2 = temp[:]
    result = []
    for item in temp2:
        result.append(item * 2)
    return result
''')

for i in range(10):
    samples.append(f'''"""
Memory-heavy nested structures {i+1}
"""
def create_nested_{i}(size):
    result = []
    for i in range(size):
        inner = []
        for j in range(size):
            inner.append(i * j)
        result.append(inner)
    return result
''')

# ===== RECURSION TO ITERATION (30 samples) =====

for i in range(10):
    samples.append(f'''"""
Recursive factorial {i+1}
"""
def factorial_{i}(n):
    if n <= 1:
        return 1
    return n * factorial_{i}(n - 1)
''')

for i in range(10):
    samples.append(f'''"""
Recursive fibonacci {i+1}
"""
def fibonacci_{i}(n):
    if n <= 1:
        return n
    return fibonacci_{i}(n - 1) + fibonacci_{i}(n - 2)
''')

for i in range(10):
    samples.append(f'''"""
Recursive list sum {i+1}
"""
def recursive_sum_{i}(lst):
    if not lst:
        return 0
    return lst[0] + recursive_sum_{i}(lst[1:])
''')

# ===== ALGORITHMIC OPTIMIZATIONS (50 samples) =====

for i in range(10):
    samples.append(f'''"""
Inefficient search {i+1}
"""
def find_item_{i}(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1
''')

for i in range(10):
    samples.append(f'''"""
Nested loop inefficiency {i+1}
"""
def find_pairs_{i}(arr1, arr2, target):
    result = []
    for i in range(len(arr1)):
        for j in range(len(arr2)):
            if arr1[i] + arr2[j] == target:
                result.append((i, j))
    return result
''')

for i in range(10):
    samples.append(f'''"""
Repeated calculations {i+1}
"""
def process_matrix_{i}(matrix):
    result = []
    for row in matrix:
        row_sum = 0
        for val in row:
            row_sum = row_sum + val
        avg = row_sum / len(row)
        result.append(avg)
    return result
''')

for i in range(10):
    samples.append(f'''"""
Inefficient sorting {i+1}
"""
def sort_list_{i}(items):
    result = []
    remaining = items[:]
    while remaining:
        min_val = remaining[0]
        for item in remaining:
            if item < min_val:
                min_val = item
        result.append(min_val)
        remaining.remove(min_val)
    return result
''')

for i in range(10):
    samples.append(f'''"""
Quadratic complexity {i+1}
"""
def find_duplicates_{i}(arr):
    duplicates = []
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j]:
                duplicates.append(arr[i])
    return duplicates
''')

# ===== DATA STRUCTURE OPTIMIZATIONS (40 samples) =====

for i in range(10):
    samples.append(f'''"""
List membership check {i+1}
"""
def check_membership_{i}(items, target):
    for item in items:
        if item == target:
            return True
    return False
''')

for i in range(10):
    samples.append(f'''"""
Inefficient counting {i+1}
"""
def count_occurrences_{i}(items, target):
    count = 0
    for item in items:
        if item == target:
            count = count + 1
    return count
''')

for i in range(10):
    samples.append(f'''"""
Multiple passes {i+1}
"""
def analyze_data_{i}(data):
    max_val = data[0]
    for item in data:
        if item > max_val:
            max_val = item
    
    min_val = data[0]
    for item in data:
        if item < min_val:
            min_val = item
    
    return max_val - min_val
''')

for i in range(10):
    samples.append(f'''"""
Inefficient dictionary access {i+1}
"""
def process_dict_{i}(d, keys):
    result = []
    for key in keys:
        if key in d:
            result.append(d[key])
        else:
            result.append(None)
    return result
''')

# ===== QUALITY/READABILITY (30 samples) =====

for i in range(10):
    samples.append(f'''"""
Long function {i+1}
"""
def complex_function_{i}(data):
    result = []
    for item in data:
        if item > 0:
            if item < 100:
                if item % 2 == 0:
                    if item % 3 == 0:
                        result.append(item)
    return result
''')

for i in range(10):
    samples.append(f'''"""
Magic numbers {i+1}
"""
def process_scores_{i}(scores):
    passed = []
    for score in scores:
        if score >= 60:
            passed.append(score)
    return passed
''')

for i in range(10):
    samples.append(f'''"""
Repeated code {i+1}
"""
def validate_data_{i}(data):
    if len(data) == 0:
        return False
    if data[0] < 0:
        return False
    if data[0] > 100:
        return False
    if len(data) < 2:
        return False
    if data[1] < 0:
        return False
    if data[1] > 100:
        return False
    return True
''')

# ===== ADVANCED PATTERNS (50 samples) =====

for i in range(10):
    samples.append(f'''"""
Generator pattern {i+1}
"""
def generate_numbers_{i}(n):
    result = []
    for i in range(n):
        result.append(i * i * i)
    return result
''')

for i in range(10):
    samples.append(f'''"""
Comprehension opportunity {i+1}
"""
def transform_data_{i}(items):
    result = []
    for item in items:
        if item > 0:
            result.append(item * item)
    return result
''')

for i in range(10):
    samples.append(f'''"""
Map/filter pattern {i+1}
"""
def process_numbers_{i}(numbers):
    filtered = []
    for n in numbers:
        if n > 0:
            filtered.append(n)
    result = []
    for n in filtered:
        result.append(n * 2)
    return result
''')

for i in range(10):
    samples.append(f'''"""
String operations {i+1}
"""
def clean_strings_{i}(strings):
    result = []
    for s in strings:
        cleaned = s.strip()
        cleaned = cleaned.lower()
        cleaned = cleaned.replace(" ", "_")
        result.append(cleaned)
    return result
''')

for i in range(10):
    samples.append(f'''"""
Nested comprehensions {i+1}
"""
def flatten_matrix_{i}(matrix):
    result = []
    for row in matrix:
        for item in row:
            result.append(item)
    return result
''')

# Generate all files
print(f"Generating {len(samples)} code samples...")

# Remove old samples (keep original 5)
for i in range(6, 1000):  # Remove any old generated samples
    old_file = dataset_dir / f"sample_{i:03d}.py"
    if old_file.exists():
        old_file.unlink()

# Write new samples
for idx, code in enumerate(samples, start=6):
    filename = dataset_dir / f"sample_{idx:03d}.py"
    with open(filename, 'w') as f:
        f.write(code)

print(f"✅ Generated {len(samples)} new code samples!")
print(f"Total samples: {5 + len(samples)}")
print(f"Files saved to: {dataset_dir}")

