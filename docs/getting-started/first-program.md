---
title: "Your first program"
description: "Write, compile, and run a Chuchu program using variables, input, functions, arrays, and show."
---

Create a file named `hello.chuchu`:

```chuchu title="hello.chuchu"
assign x as 10
assign y as 20
show x + y
```

Compile it, then run the executable separately:

```bash
cheeku hello.chuchu -o hello
./hello
```

```text title="Output"
30
```

`assign` introduces a variable, followed by its name, `as`, and its initial value. `show` prints a scalar or string followed by a newline. Each statement is separated by a newline.

:::tip Using a compiler you have not installed
Replace `cheeku` with the path to your release binary, such as `./target/release/cheeku` from the compiler repository.
:::

## Change a value

A variable keeps the type inferred from its declaration. Use `reassign` to update it:

```chuchu
assign counter as 0
while counter < 3 {
    show counter
    reassign counter as counter + 1
}
```

This prints `0`, `1`, and `2` on separate lines.

## Work with text

```chuchu
assign name as "world 🌍"
show "Hello, " + name + "!"
show len(name)
```

This prints `Hello, world 🌍!`, then `7`. Strings support escapes, concatenation,
content equality and typed function parameters. See [strings](../language/strings.md)
for Unicode length rules.

## Read input

`input()` returns the text you enter as a string. Pass a prompt to display it
on the same line:

```chuchu
assign name as input("Your name: ")
show "Hello, " + name + "!"
```

Entering `دنیا 🌍` prints `Hello, دنیا 🌍!`. You can use the value directly in
`show`, string expressions, or function calls.

`input` stops with a runtime diagnostic on EOF or read failure. Use
[`try_input()`](../language/input-results.md#handle-input-failures-explicitly)
when you need to handle those outcomes yourself.

## Write a function

Function parameters and return values have explicit types:

```chuchu
function square(x: int) be int {
    return x * x
}

show square(10)
```

The output is `100`. The argument and return value are integers.

## Work with a numerical array

```chuchu
assign a as [1, 2, 3]
assign b as [4, 5, 6]
show sum(a * b)
```

`a * b` multiplies corresponding elements, producing `[4, 10, 18]`. `sum` adds them and prints `32`.

## What happens when you compile?

Cheeku validates source syntax and types, generates LLVM IR, optimizes it, emits an object file, and links an executable. Successful compilation is normally quiet. The default optimization level is O2.

Continue with [variables and scope](../language/variables.md), or browse [complete examples](../guides/examples.md).
