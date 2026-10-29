---
title: "Strings"
description: "Write UTF-8 strings, use escapes and concatenation, compare text, and pass strings through typed Chuchu functions."
---

Strings are immutable UTF-8 text values written with double quotes:

```chuchu
assign name "world 🌍"
show "Hello, " + name + "!"
```

Output: `Hello, world 🌍!`. Variables infer the `string` type. Empty strings
(`""`) are valid, and `show` prints text without quotes followed by a newline.
Percent signs are ordinary text, including `%s` and `%n`.

## Escapes

| Escape | Value |
|---|---|
| `\n` | Newline |
| `\r` | Carriage return |
| `\t` | Tab |
| `\"` | Double quote |
| `\\` | Backslash |

```chuchu
show "line one\nline two"
show "She said \"hello\"."
show "A backslash: \\"
```

Put Unicode characters directly in the source. A string must close on the same
source line; use `\n` for embedded newlines. Unclosed quotes and unsupported
escapes produce [source diagnostics](../guides/errors.md). NUL characters,
including `\0`, and `\u` / `\x` escapes are not supported.

## Concatenation and equality

`+` joins two strings. `==` and `!=` compare contents:

```chuchu
assign greeting "Hello, " + "world"
show greeting + "!"
show greeting == "Hello, world"
show greeting != "Goodbye"
```

Output: `Hello, world!`, `true`, `true`.

String operations require two strings. `"count: " + 3` is a type error; numbers
and booleans are not implicitly converted. Ordering comparisons, other
arithmetic, interpolation, indexing, slicing, and string arrays are not
implemented.

## Unicode length

`len(string)` returns the number of **Unicode scalar values**:

```chuchu
show len("")
show len("hello")
show len("é中🌍")
show len("é")
```

Output: `0`, `5`, `3`, `2`. The last example contains `e` followed by a combining
accent. A combining mark counts separately, even when the result looks like one
character. `len` does not count bytes or grapheme clusters. Text is not
normalized: precomposed `"é"` and combining `"é"` compare as different strings.

## Reassignment and value semantics

```chuchu
assign original "hello"
assign saved original
reassign original original + "!"
show saved
show original
```

Output: `hello`, then `hello!`. Reassignment changes the variable's value;
previous copies retain their text. A string variable cannot be reassigned a
number or boolean.

## String functions

Use `string` in parameter and return annotations:

```chuchu
function greet(name: string) -> string {
    assign prefix "Hello, "
    return prefix + name + "!"
}
show greet("دنیا 🌍")
```

Output: `Hello, دنیا 🌍!`. Returned strings remain valid after function locals
go out of scope. The usual [function return rules](functions.md#returning-a-value)
apply.

## Storage and debugging

The current backend copies string contents on identifier reads and releases
temporary values, old reassigned values, function parameters, and locals at
scope exit. Loop-local allocations are released on every iteration. Strings
use heap storage; repeated concatenation copies the growing text and can take
quadratic time. Allocation or size failures terminate with a runtime diagnostic.

Compile with `--debug` and use `frame variable name` in LLDB to inspect the text.
See [native debugging](../tooling/debugging.md) and the compiler's
[complete string example](https://github.com/chuchu-lang/chuchu-core/blob/main/examples/strings.chuchu).
