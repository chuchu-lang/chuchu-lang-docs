---
title: "Control flow"
description: "Write Chuchu if/else branches and while loops with boolean conditions and lexical block scope."
---

## Conditions

`if` and `while` require a `bool` expression. Numbers and strings are not implicitly treated as true or false.

## Combining conditions

Use `and`, `or`, and `not` to build a `bool` condition. See [logical operators](operators.md#logical-operators).

```chuchu
assign score as 85
if score >= 80 and score < 90 {
    show 1
}
while not (score >= 90) {
    reassign score as score + 5
}
```

## If and else

```chuchu
assign score as 85
if score >= 80 {
    show 1
} else {
    show 0
}
```

This prints `1`. The `else` block is optional. Braces are required around each branch. Put a nested `if` inside an `else` block when you need another decision; `else if` shorthand is not supported.

```chuchu
assign score as 85
if score >= 90 {
    show 3
} else {
    if score >= 80 {
        show 2
    } else {
        show 1
    }
}
```

## While loops

A `while` loop evaluates its condition before each iteration:

```chuchu
assign counter as 0
while counter < 5 {
    show counter
    reassign counter as counter + 1
}
```

This prints `0` through `4`. Update the values controlling your condition so the loop can finish.

## Nested loops

```chuchu
assign i as 0
assign total as 0
while i < 3 {
    assign j as 0
    while j < 2 {
        reassign total as total + 1
        reassign j as j + 1
    }
    reassign i as i + 1
}
show total
```

The output is `6`. The inner `j` exists only within the outer loop body.

## Returning from a function

A `return` exits the enclosing function, including from inside a loop or branch. Functions must satisfy the compiler's [return rules](functions.md#returning-a-value).

`for`, `break`, and `continue` are not implemented.
