---
title: "Built-in functions"
description: "Reference for Chuchu numerical built-ins, input, conversions, results, and output."
---

Built-ins are called by name in expressions. Their names cannot be used for user function declarations.

| Function | Accepted input | Result | Behavior |
|---|---|---|---|
| `abs(x)` | `int` or `float` | Same scalar type | Absolute value |
| `sqrt(x)` | `float` | `float` | Square root |
| `min(a, b)` | Numeric scalars | `float` if either input is float, otherwise `int` | Minimum |
| `max(a, b)` | Numeric scalars | `float` if either input is float, otherwise `int` | Maximum |
| `length(a)` | Numeric array or string | `int` | Array element count, or Unicode scalar count for strings |
| `sum(a)` | Numeric array | Scalar element type | Ordered sum |
| `input()` or `input(prompt)` | Optional `string` prompt | `string` | Read a UTF-8 line directly; stop with a runtime error on EOF or read failure |
| `try_input()` or `try_input(prompt)` | Optional `string` prompt | `result<string>` | Read a UTF-8 line with explicit EOF and error handling |
| `read_file(path)` | String path | `string` | Read a complete UTF-8 file; stop on failure |
| `try_read_file(path)` | String path | `result<string>` | Read a file with recoverable errors |
| `write_file(path, text)` | String path and text | `int` | Replace or create a file; return bytes written; stop on failure |
| `try_write_file(path, text)` | String path and text | `result<int>` | Write a file with recoverable errors |
| `parse_int(text)` | String | `result<int>` | Strict signed decimal parsing |
| `parse_float(text)` | String | `result<float>` | Strict finite decimal parsing |
| `to_string(value)` | Int, float, bool, or string | `string` | Explicit conversion |
| `ok(value)` | Scalar | `result<T>` | Construct success |
| `is_ok(r)`, `is_eof(r)` | Result | `bool` | Inspect status |
| `error_code(r)` | Result | `int` | Read status |
| `error_message(r)` | Result | `string` | Describe status |
| `unwrap(r)` | Result | Payload type | Extract success; checked failure on error |

`length` replaces the former built-in name `len`; update older programs to use
`length(...)`. `len` is no longer a built-in.

## Examples

```chuchu
show abs(-7)
show abs(-3.5)
show sqrt(9.0)
show min(2, 3.5)
show max(2.0, 3)
show length([1, 2, 3])
show sum([1, 2, 3])
```

```text title="Output"
7
3.5
3
2
3
3
6
```

## Edge cases

- `sqrt` requires an actual float argument: `sqrt(9)` is a type error; use `sqrt(9.0)`.
- `sqrt` of a negative float produces NaN.
- Floating `min` and `max` lower to C `fmin` and `fmax`. With one NaN argument and one numeric argument, they return the numeric value.
- `abs` of the minimum signed integer fails because its positive value cannot fit in the current integer representation.
- Integer `sum` checks every addition for overflow.
- `length("é中🌍")` is `3`; combining marks count separately. See [string length](strings.md#unicode-length).
- `length` still evaluates its array argument, so it does not suppress failures in an expression that constructs the array.

## Input

Read a string directly, with an optional prompt:

```chuchu
assign name as input("Your name: ")
show name
```

`input` prints and flushes its prompt without adding a newline. It returns a
string, so use its value directly. EOF or a read failure stops with a runtime
diagnostic. `try_input` accepts the same arguments and returns `result<string>`
for explicit recovery. See [input and results](input-results.md).

## Show

`show expression` is a statement, not a function call. It accepts integer, float, or boolean scalars and strings and prints a trailing newline. See [output formatting](types.md#output-formatting).

See [input and results](input-results.md) for contracts, error codes, custom
`err<T>(code)` construction, and an interactive example. `show` rejects results;
print an unwrapped payload or an error message.

See [file I/O](files.md) for whole-file UTF-8 reads and writes, and
[modules and imports](modules.md) for sharing functions and records across files.
