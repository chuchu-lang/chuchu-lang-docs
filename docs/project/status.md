---
title: "Language status"
description: "See implemented Chuchu features, current limitations, platform support, and documentation version policy."
---

These docs describe the **0.1 development codebase**. The package reports `0.1.0`; this does not imply a published binary distribution or a stable language specification.

## Implemented

- Inferred local variables and typed reassignment.
- Signed integers, floats, booleans, immutable UTF-8 strings, and homogeneous fixed-size numeric arrays.
- Arithmetic, comparisons, grouping, and unary negation.
- `if` / `else`, `while`, lexical scope, and block shadowing.
- Top-level typed functions, forward calls, recursion, and mutual recursion.
- Numerical built-ins: `abs`, `sqrt`, `min`, `max`, `sum`, `len`.
- Scalar and string output through `show`.
- UTF-8 standard input, explicit number/string conversions, and recoverable scalar results.
- String concatenation, content equality, Unicode scalar length, and typed string functions.
- Source excerpts, line/column diagnostics, carets, and repair guidance.
- Native debug metadata, LLDB inspection, and `--debug` / `-g` build flags.
- Native object emission and executable linking.
- O0–O3 optimization, CPU selection, timing JSON, IR and assembly output.
- Runtime checks for integer arithmetic, division, and array bounds.

## Current limits

| Area | Status |
|---|---|
| Platforms | macOS ARM64/Intel, Linux x64 GNU, Windows x64 MSVC are native targets; see validation details below |
| Arrays | 1–256 homogeneous numeric elements; no element assignment |
| Function signatures | `int`, `float`, `bool`, `string`, and scalar `result<T>`; no array annotations |
| Text | Strings implemented; no NUL bytes, indexing, interpolation, character literals, or comments |
| Control flow | No `for`, `break`, `continue`, or logical operators |
| Modules and data | No imports, user-defined types, dynamic collections, or file I/O API |
| Runtime | Standard input implemented; no JIT, GPU execution, or automatic parallelism |
| Tooling | Native debugging implemented; no Chuchu expression evaluator, official language server, or browser playground |

These are implementation boundaries, not announced roadmap commitments.

## Platform validation

One shared compiler targets its host OS; there is no cross-OS `--target` flag.
The repository's native CI matrix covers macOS ARM64, macOS Intel, Linux x64 GNU,
and Windows x64 MSVC. These targets require their documented host toolchains.

The latest input, conversion, result, string, and debugger changes passed local native checks on macOS
ARM64, including O0–O3 behavior, debugger sessions and allocation/sanitizer
checks. Check current CI results before claiming that revision is validated on
another target. Real LLDB smoke sessions run in macOS/Linux CI; Windows debugger
sessions, interactive console input, and editor/DAP behavior remain pending validation. See [installation](../getting-started/installation.md)
and [native debugging](../tooling/debugging.md).

## Documentation versions

The site currently documents one development line. We will only need separate versioned docs when released language versions have differences worth maintaining. Docusaurus supports snapshots without requiring them from the start.

When you encounter a mismatch, check your compiler checkout and open an issue in the [compiler repository](https://github.com/chuchu-lang/chuchu-core/issues) or [documentation repository](https://github.com/chuchu-lang/chuchu-lang-docs/issues).
