---
title: "Variables & scope"
description: "Declare and reassign Chuchu variables, understand lexical scope, and write valid identifiers."
---

## Declare a variable

Use `assign` for new declarations and `reassign` to change an existing value. Use `declare` to create a variable now and give it a value later. Put `as` between the variable name and its value: `assign name as expression` or `reassign name as expression`. The `as` keyword is required for both statements.

Use `assign name as expression`:

```chuchu
assign count as 10
assign ratio as 2.5
assign ready as true
```

The initializer determines the variable's type. Local declarations do not use type annotations. A variable must be declared before it is read.

## Declare a variable without a value

Use `declare name` when a variable must exist before its value is known. It has no `as` clause:

```chuchu
declare total
reassign total as 40
reassign total as total + 2
show total
```

The output is `42`. The first `reassign` fixes the variable's type, and every later assignment must preserve it, with the same `int`-to-`float` widening as any other variable. Declaring the same name twice in one scope is an error.

A `declare`d variable can be read only when every path that reaches the read has already assigned it. Assign it in both branches of an `if` and the read afterwards is valid:

```chuchu
declare label
if count > 0 {
    reassign label as "some"
} else {
    reassign label as "none"
}
show label
```

Assignments inside a `while` body do not count after the loop, because the body might never run. An `if` that assigns in only one branch is the same. Reading the variable in either case is a compile error, as is reading it before any assignment.

"First" means first in the source text. If the first `reassign` is inside an `if` branch, that statement sets the type for the rest of the program.

## Reassign a value

```chuchu
assign count as 10
reassign count as count + 5
show count
```

The output is `15`. Reassignment must preserve the declared type, with one widening conversion: an `int` can be assigned to an existing `float` variable.

```chuchu
assign measurement as 1.0
reassign measurement as 2
show measurement
```

Assigning a float to an integer variable is a type error. Declaring the same name twice in the same scope is also an error; use `reassign` to update an existing variable.

## Lexical scope

Each `if` branch and `while` body introduces a scope. A block can read and reassign an enclosing variable. A new declaration can shadow its name:

```chuchu
assign x as 10
if true {
    assign x as x + 20
    show x
    reassign x as 40
}
show x
```

This prints `30`, then `10`. The inner initializer reads the outer `x` before the inner binding is introduced. The inner reassignment changes only the inner binding.

Names declared inside a block are unavailable outside that block. Functions have their own scope and cannot capture top-level variables; pass values as arguments instead.

## Identifiers and reserved words

Names start with an ASCII letter or underscore and continue with ASCII letters, digits, or underscores. Names are case-sensitive.

Examples: `total`, `total_1`, `_value`, `squarePlus`.

The lexer reserves `assign`, `declare`, `as`, `show`, `true`, `false`, `if`, `else`, `while`, `function`, `be`, `reassign`, `return`, `err`, `record`, `module`, `use`, and `export`. Function names have [additional restrictions](functions.md#function-names).

## Whitespace and statements

Separate statements with newlines. Braces delimit blocks; indentation is for readability. A single statement may appear inline inside braces:

```chuchu
if true { show 42 }
```

Semicolons are not supported. Use `//` for line comments and `/* ... */` for block comments. See [comments](comments.md) for syntax and colored annotations.
