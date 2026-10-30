---
title: "Examples"
description: "Run complete Chuchu examples for arithmetic, recursion, strings, numerical arrays, and nested loops."
---

Each example below is a complete program. Save it to a `.chuchu` file, then compile and run it:

```bash
cheeku example.chuchu -o example
./example
```

## A string greeting

```chuchu
function greet(name: string) -> string {
    return "Hello, " + name + "!"
}
assign name as "دنیا 🌍"
show greet(name)
show len(name)
```

Output: `Hello, دنیا 🌍!`, then `6`. `len` counts Unicode scalar values,
including the space and emoji. See [strings](../language/strings.md).

## Interactive input

```chuchu
show "Enter an integer:"
assign line as read_line()
if is_ok(line) {
    assign parsed as parse_int(unwrap(line))
    if is_ok(parsed) {
        show "Double: " + to_string(unwrap(parsed) * 2)
    } else {
        show error_message(parsed)
    }
} else {
    show error_message(line)
}
```

Entering `21` prints `Double: 42`. Invalid numbers produce an error message;
EOF is reported separately. For retries and custom errors, run the
[temperature converter](https://github.com/chuchu-lang/chuchu-core/blob/main/examples/temperature.chuchu)
and read [input and results](../language/input-results.md).

## Circle area

```chuchu
assign pi as 3.14159
assign radius as 5.0
assign area as pi * radius * radius
show area
```

Output: `78.53975`.

## Factorial

```chuchu
function factorial(n: int) -> int {
    if n <= 1 {
        return 1
    } else {
        return n * factorial(n - 1)
    }
}
show factorial(5)
```

Output: `120`.

## Dot product

```chuchu
assign a as [1, 2, 3]
assign b as [4, 5, 6]
show sum(a * b)
```

Output: `32`. Multiplication creates an element-wise product; reduction sums it.

## A typed function with widening

```chuchu
function half(x: float) -> float {
    return x / 2.0
}
show half(9)
```

Output: `4.5`. The integer argument widens to float.

## Nested iteration

```chuchu
assign i as 0
assign total as 0
while i < 3 {
    assign j as 0
    while j < 2 {
        reassign total as total + i * j
        reassign j as j + 1
    }
    reassign i as i + 1
}
show total
```

Output: `3`.

## More examples in the repository

The [compiler examples directory](https://github.com/chuchu-lang/chuchu-core/tree/main/examples) contains strings, arithmetic, conditions, loops, functions, floats, arrays, and a syntax smoke test. The [benchmark sources](https://github.com/chuchu-lang/chuchu-core/tree/main/benchmarks/chuchu) exercise longer numerical workloads.

For a complete list of supported constructs, see [language status](../project/status.md).
