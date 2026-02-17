# Demo Codes for Testing

This file contains example Python code snippets you can use to test the RL Code Agent optimization system. Copy and paste any of these into the dashboard to see how the agent optimizes them.

---

## 1. Simple Loop Optimization

**Baseline:** O(n) with repeated addition  
**Expected Optimization:** Use built-in `sum()` function

```python
def sum_list(nums):
    total = 0
    for num in nums:
        total = total + num
    return total
```

---

## 2. List Comprehension Optimization

**Baseline:** Append in loop  
**Expected Optimization:** List comprehension

```python
def square_numbers(nums):
    result = []
    for num in nums:
        result.append(num * num)
    return result
```

---

## 3. Recursion to Iteration

**Baseline:** Recursive function with stack overhead  
**Expected Optimization:** Iterative version

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
```

---

## 4. Nested Loop Optimization

**Baseline:** O(n²) nested loops  
**Expected Optimization:** Use set for O(n) lookup

```python
def find_duplicates(arr1, arr2):
    result = []
    for item1 in arr1:
        for item2 in arr2:
            if item1 == item2:
                result.append(item1)
                break
    return result
```

---

## 5. Memory Optimization

**Baseline:** Creating new list each iteration  
**Expected Optimization:** List comprehension or generator

```python
def filter_positive(numbers):
    result = []
    for num in numbers:
        if num > 0:
            result.append(num)
    return result
```

---

## 6. String Concatenation

**Baseline:** String concatenation in loop  
**Expected Optimization:** Use `join()` method

```python
def build_string(words):
    result = ""
    for word in words:
        result = result + word + " "
    return result.strip()
```

---

## 7. Dictionary Lookup Optimization

**Baseline:** Multiple if-elif checks  
**Expected Optimization:** Dictionary mapping

```python
def get_day_name(day_num):
    if day_num == 0:
        return "Monday"
    elif day_num == 1:
        return "Tuesday"
    elif day_num == 2:
        return "Wednesday"
    elif day_num == 3:
        return "Thursday"
    elif day_num == 4:
        return "Friday"
    elif day_num == 5:
        return "Saturday"
    elif day_num == 6:
        return "Sunday"
    return "Invalid"
```

---

## 8. Fibonacci Recursive

**Baseline:** Inefficient recursive Fibonacci  
**Expected Optimization:** Iterative or memoized version

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

---

## 9. List Reversal

**Baseline:** Creating new list with append  
**Expected Optimization:** In-place reversal or slicing

```python
def reverse_list(items):
    result = []
    for i in range(len(items) - 1, -1, -1):
        result.append(items[i])
    return result
```

---

## 10. Maximum Value Search

**Baseline:** Manual loop to find max  
**Expected Optimization:** Built-in `max()` function

```python
def find_max(numbers):
    if not numbers:
        return None
    max_val = numbers[0]
    for num in numbers:
        if num > max_val:
            max_val = num
    return max_val
```

---

## 11. List Flattening

**Baseline:** Nested loops for flattening  
**Expected Optimization:** List comprehension or itertools

```python
def flatten_list(nested_list):
    result = []
    for sublist in nested_list:
        for item in sublist:
            result.append(item)
    return result
```

---

## 12. Prime Number Check

**Baseline:** Inefficient prime checking  
**Expected Optimization:** Optimized algorithm with early exit

```python
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True
```

---

## 13. Count Occurrences

**Baseline:** Manual counting loop  
**Expected Optimization:** Use `collections.Counter` or dictionary

```python
def count_items(items):
    counts = {}
    for item in items:
        if item in counts:
            counts[item] = counts[item] + 1
        else:
            counts[item] = 1
    return counts
```

---

## 14. Matrix Transpose

**Baseline:** Nested loops for transpose  
**Expected Optimization:** List comprehension or NumPy

```python
def transpose_matrix(matrix):
    result = []
    for j in range(len(matrix[0])):
        row = []
        for i in range(len(matrix)):
            row.append(matrix[i][j])
        result.append(row)
    return result
```

---

## 15. Remove Duplicates

**Baseline:** Manual duplicate removal  
**Expected Optimization:** Use set or dict.fromkeys()

```python
def remove_duplicates(items):
    result = []
    seen = []
    for item in items:
        if item not in seen:
            seen.append(item)
            result.append(item)
    return result
```

---

## Usage Tips

1. **Copy any code snippet** above and paste it into the dashboard
2. **Adjust preferences** (runtime, memory, quality) to see different optimization strategies
3. **Compare results** - the agent will show you the optimized version with metrics
4. **Try multiple refinements** - the agent can iteratively improve the code

---

## What to Expect

The RL Code Agent will:
- Analyze your code for optimization opportunities
- Select the best strategy (algorithmic, memory, vectorization, etc.)
- Generate optimized code with improved performance
- Show you metrics: runtime improvement, memory reduction, code quality
- Provide a diff view to see exactly what changed

---

*These demo codes are designed to showcase different types of optimizations the agent can perform.*

