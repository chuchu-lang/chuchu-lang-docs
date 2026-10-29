---
title: "Errors & diagnostics"
description: "Understand Chuchu compile-time source diagnostics, runtime overflow, division by zero, and array bounds diagnostics."
---

Cheeku reports compile-time errors to stderr and exits unsuccessfully. Successful compilation is normally quiet.

## Source locations

Source errors show a file path, one-based line and column, a source excerpt,
a caret, and repair guidance when available. For example, this is invalid:

```chuchu title="Invalid: missing operand"
show 1 +
```

```text title="Compiler diagnostic"
cheeku: error: Expected expression after '+'
  --> example.chuchu:1:9
  |
1 | show 1 +
  |         ^ missing operand
  = help: Add a number, variable, or expression after '+'.
```

Add a value after the operator, for example `show 1 + 2`. Unclosed braces,
parentheses, and brackets also identify the line with the opening delimiter
when possible. Missing closing quotes and unsupported string escapes have
specific messages.

Caret display expands tabs to four-column tab stops. The compiler's structured
Rust errors still carry zero-based UTF-8 byte spans (`start..end`, exclusive end).
Runtime messages also retain byte spans; they do not yet use the CLI excerpt
renderer. Filesystem, linker, and internal backend errors may use plain messages.

## Common compile-time errors

| Problem | Example | How to fix it |
|---|---|---|
| Undefined variable | `show missing` | Declare it first, or pass it as a function argument. |
| Duplicate declaration | Two `assign x ...` statements in one scope | Use `reassign`, or choose another name. |
| Invalid condition | `if 1 { show 1 }` | Use a boolean comparison such as `1 > 0`. |
| Type mismatch | Reassigning `2.5` to an integer variable | Preserve the declared type. |
| Invalid array | `[1, 2.0]` | Use homogeneous integer or float elements. |
| Missing return | A function without a value on all required paths | Return from both branches or add a fallback return. |
| Invalid source character | A comment marker or unsupported symbol | Use the current language syntax. |
| Unterminated string | An opening double quote without a closing quote | Close the quote on the same source line. |
| Invalid escape | `"bad\q"` | Use one of the supported [string escapes](../language/strings.md#escapes). |
| Mixed string operands | `"count: " + 3` | Combine two strings; automatic numeric conversion is not supported. |
| Statement separator | `show 1 show 2` | Place each statement on its own line. |

These examples illustrate invalid code; they are not runnable programs.

## Runtime failures

A program can compile successfully but fail when executed. Checked failures write a message beginning with `cheeku runtime:` to stderr and exit with status `1`.

```chuchu
assign divisor 0
show 1 / divisor
```

This compiles, but running it reports division by zero. Other checked failures include:

- Signed integer addition, subtraction, multiplication, negation, and absolute-value overflow.
- Minimum integer divided by `-1`.
- Floating division by positive or negative zero.
- Negative or out-of-range array indices.
- Overflow during integer array arithmetic or reduction.
- String allocation or concatenation size failures.

Checks remain active at O0, O1, O2, and O3.

## Build and linker errors

Compiler setup errors are separate from source errors. An LLVM discovery failure occurs while building Cheeku; a missing Clang linker prevents producing native executables. See [installation troubleshooting](../getting-started/installation.md#troubleshooting-installation).

The compiler stages its executable and replaces the requested output only after linking succeeds. Optional IR and assembly files are written separately and can remain after a later failure. Input/artifact collisions, including debug sidecars, are rejected by the compiler APIs. Debug symbol generation happens before executable publication. When replacing symbols fails, the compiler attempts rollback and preserves recovery files if rollback itself fails. Multiple artifact renames do not provide a single power-loss-atomic transaction.
