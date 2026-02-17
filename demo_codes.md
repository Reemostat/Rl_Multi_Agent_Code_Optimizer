# Demo Code Samples for RL Agent Testing

These code samples are designed to trigger different actions from the RL model. Copy and paste them into the dashboard to test the agent's decision-making.

---

## 🚀 Action 0: Runtime Agent (Algorithmic Optimization)
**Expected:** High complexity, nested loops → triggers Action 0

```python
def process_matrix(matrix):
    result = []
    for row in matrix:
        for col in row:
            if col > 0:
                temp = []
                for i in range(100):
                    for j in range(100):
                        if i * j > col:
                            temp.append(i * j)
                result.extend(temp)
    return result

# Test
data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
print(process_matrix(data))
```

**Why Action 0?**
- 4 levels of nesting
- High cyclomatic complexity
- Multiple nested loops
- Inefficient O(n⁴) algorithm

---

## 💾 Action 1: Memory Agent (Memory Optimization)
**Expected:** High memory usage → triggers Action 1

```python
def create_large_structures(n):
    data = []
    for i in range(n):
        temp_list = []
        for j in range(10000):
            temp_list.append(str(i) * 100)  # Large strings
        data.append(temp_list)
    
    # Create more copies
    result = []
    for item in data:
        result.append(item.copy())
        result.append(item.copy())
    
    return result

# Test
print("Creating large structures...")
result = create_large_structures(50)
print(f"Created {len(result)} lists")
```

**Why Action 1?**
- Creates many large lists
- High memory footprint
- Copies data multiple times
- Memory-intensive operations

---

## 🔄 Action 2: In-place Refactor (Runtime + Memory)
**Expected:** Moderate complexity and memory → triggers Action 2

```python
def process_data(items):
    results = []
    processed = {}
    
    for item in items:
        if item not in processed:
            temp = []
            for i in range(100):
                temp.append(item * i)
            processed[item] = temp
        results.extend(processed[item])
    
    return results

# Test
data = [1, 2, 3, 4, 5] * 10
print(process_data(data))
```

**Why Action 2?**
- Moderate complexity
- Moderate memory usage
- Can benefit from both runtime and memory optimization
- Balanced needs

---

## 🔁 Action 3: Recursion Agent
**Expected:** Recursive code → triggers Action 3

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Test
print(f"Fibonacci(20) = {fibonacci(20)}")
print(f"Factorial(10) = {factorial(10)}")
```

**Why Action 3?**
- Multiple recursive functions
- Recursion flag detected
- Can be optimized with memoization or iteration

---

## 🔂 Action 4: Loop Optimization Agent
**Expected:** Many loops → triggers Action 4

```python
def process_multiple_arrays(arr1, arr2, arr3, arr4):
    result = []
    
    for a in arr1:
        for b in arr2:
            for c in arr3:
                for d in arr4:
                    if a + b + c + d > 100:
                        result.append((a, b, c, d))
    
    filtered = []
    for item in result:
        if item[0] > 10:
            filtered.append(item)
    
    final = []
    for item in filtered:
        for i in range(5):
            final.append(item[0] * i)
    
    return final

# Test
a1 = list(range(10))
a2 = list(range(10))
a3 = list(range(10))
a4 = list(range(10))
print(len(process_multiple_arrays(a1, a2, a3, a4)))
```

**Why Action 4?**
- Many nested loops
- High iteration count
- Can be optimized with vectorization or better algorithms

---

## 🎯 Action 5: Hybrid Agent (All Agents)
**Expected:** Multiple issues → triggers Action 5

```python
def complex_memory_intensive_recursive(data, depth=0):
    if depth > 5:
        return []
    
    result = []
    large_list = [str(i) * 1000 for i in range(1000)]
    
    for item in data:
        if item > 0:
            for subitem in large_list:
                temp = []
                for i in range(100):
                    temp.append(subitem * i)
                result.extend(temp)
        
        # Recursive call
        result.extend(complex_memory_intensive_recursive([item], depth + 1))
    
    return result

# Test
data = [1, 2, 3, 4, 5]
print(len(complex_memory_intensive_recursive(data)))
```

**Why Action 5?**
- High complexity (nested loops)
- High memory (large lists)
- Recursion present
- Multiple optimization opportunities

---

## ✅ Action 6: STOP (Already Optimal)
**Expected:** Clean, efficient code → triggers Action 6

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Test
sorted_arr = [1, 3, 5, 7, 9, 11, 13, 15]
print(binary_search(sorted_arr, 7))
```

**Why Action 6?**
- Efficient algorithm (O(log n))
- Clean code structure
- No obvious optimization needed
- Model may decide to STOP

---

## 🧪 Challenge Code: Mixed Patterns
**Expected:** Unpredictable - tests model's decision-making

```python
def data_processor(items, use_cache=True):
    cache = {}
    results = []
    
    def helper(item, level=0):
        if level > 3:
            return []
        if item in cache:
            return cache[item]
        
        temp = []
        for i in range(50):
            if i % 2 == 0:
                temp.append(i * item)
            else:
                temp.extend(helper(item - 1, level + 1))
        
        if use_cache:
            cache[item] = temp
        return temp
    
    for item in items:
        results.extend(helper(item))
    
    return results

# Test
print(len(data_processor([1, 2, 3, 4, 5])))
```

**Why Challenge?**
- Mix of recursion and iteration
- Caching strategy
- Moderate complexity
- Tests model's ability to choose best strategy

---

## 📊 Performance Test: Matrix Operations
**Expected:** Action 0 or Action 4 (runtime optimization)

```python
def matrix_multiply(A, B):
    n = len(A)
    result = [[0] * n for _ in range(n)]
    
    for i in range(n):
        for j in range(n):
            for k in range(n):
                result[i][j] += A[i][k] * B[k][j]
    
    return result

# Test
size = 20
A = [[1] * size for _ in range(size)]
B = [[2] * size for _ in range(size)]
result = matrix_multiply(A, B)
print(f"Result matrix size: {len(result)}x{len(result[0])}")
```

**Why?**
- Triple nested loops
- O(n³) complexity
- Classic optimization target

---

## 🎲 Random Challenge: Unpredictable
**Expected:** Model decides based on state features

```python
import random

def random_processor(data, iterations=100):
    results = []
    seen = set()
    
    for _ in range(iterations):
        temp = []
        for item in data:
            if random.random() > 0.5:
                if item not in seen:
                    seen.add(item)
                    for i in range(10):
                        temp.append(item * i)
                else:
                    temp.append(item * 2)
            else:
                temp.append(item)
        results.append(temp)
    
    return results

# Test
data = list(range(20))
print(len(random_processor(data)))
```

**Why?**
- Random behavior
- Set operations
- Multiple iterations
- Tests model's robustness

---

## 💡 Tips for Testing

1. **Start with Action 0 code** - Most likely to trigger runtime agent
2. **Try Action 1 code** - Should trigger memory agent if memory preference is high
3. **Test Action 3 code** - Recursive code should trigger recursion agent
4. **Adjust preferences** - Change runtime/memory/quality sliders to see how it affects action selection
5. **Compare results** - See which actions produce better optimizations for different code types

---

## 📈 Expected Action Probabilities

When testing, check the dashboard's "Policy Decision" panel to see:
- **Action Probabilities**: Which actions the model considers
- **Entropy**: How confident the model is (higher = more exploration)
- **Confidence**: Probability of selected action (lower = more diverse)

**Good signs:**
- Entropy > 0.5 (exploring different actions)
- Confidence < 0.9 (not overconfident)
- Action distribution shows variety

**Warning signs:**
- Entropy < 0.3 (policy collapse)
- Confidence > 0.95 (overconfident)
- Always same action (needs more training)

