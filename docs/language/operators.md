---
title: "Operators & expressions"
description: "Use Chuchu arithmetic, comparisons, precedence, grouping, and checked integer division."
---

## Operator precedence

From highest to lowest:

| Priority | Operators | Meaning |
|---|---|---|
| Highest | `f(...)`, `a[...]` | Named function call, array indexing |
| Unary | `-x` | Numeric negation |
| Multiplicative | `*`, `/` | Multiplication, division |
| Additive | `+`, `-` | Addition, subtraction |
| Comparison | `==`, `!=`, `<`, `<=`, `>`, `>=` | Comparison returning `bool` |
| Logical not | `not` | Boolean negation |
| Logical and | `and` | Short-circuiting conjunction |
| Lowest | `or` | Short-circuiting disjunction |

Binary operators at the same priority group left to right. Parentheses override precedence.

```chuchu
show 10 + 20 * 2
show (10 + 20) * 2
show 20 - 3 - 2
```

Output: `50`, `60`, `15`.

## Arithmetic

Scalar arithmetic accepts numbers. Mixed integer/float operands produce a float. Two integer operands produce an integer, including division:

```chuchu
show 5 / 2
show -7 / 2
show 5 / 2.0
```

Output: `2`, `-3`, `2.5`. Integer division truncates toward zero.

Integer overflow and division by zero are runtime errors. Dividing the minimum signed integer by `-1` also fails. Optimization levels preserve these checks.

## Comparisons

Numeric comparisons accept mixed integer/float operands and return a boolean. Booleans support only `==` and `!=`.

```chuchu
show 4 >= 4
show true == false
show 2 < 3.5
```

Output: `true`, `false`, `true`.

NaN follows ordered floating comparisons: equality and ordered comparisons with NaN are false, while `!=` with NaN is true. Comparison operators share a precedence level; use separate expressions rather than mathematical comparison chains such as `1 < x < 10`.

## Logical operators

`and`, `or`, and `not` work on `bool` values only; numbers and strings are never implicitly truthy or falsy.

```chuchu
assign age as 25
assign member as true
show age >= 18 and member
show age < 18 or not member
show not (age == 25)
```

Output: `true`, `false`, `false`.

`not` binds looser than comparisons, so `not a < b` means `not (a < b)`. `and` binds tighter than `or`, so `a or b and c` means `a or (b and c)`. Use parentheses to make intent explicit.

`and` and `or` short-circuit: the right operand is evaluated only when the left one does not already decide the result. In `x != 0 and 10 / x > 1`, the division never runs when `x` is `0`. Symbolic forms (`&&`, `||`, `!`) are not supported; `!` is only valid in `!=`.

## String operators

Two strings support `+` for concatenation and `==` / `!=` for content equality:

```chuchu
show "Hello, " + "world!"
show "same" == "sa" + "me"
```

Output: `Hello, world!`, then `true`. Strings do not support ordering comparisons,
other arithmetic, or implicit number conversion. See [strings](strings.md).

## Array operators

`+` and `*` operate element by element on arrays with identical numeric element types and lengths. Arrays do not support subtraction, division, comparison, or scalar broadcasting.

## Evaluation order

The current compiler lowers binary operands and function arguments from left to right. Array products are computed before a surrounding `sum` reduction, preserving runtime error order.

`and` and `or` evaluate their right operand lazily, as described above. Modulo, exponentiation, and compound assignment are not implemented.
