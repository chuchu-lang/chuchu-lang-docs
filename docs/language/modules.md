---
title: "Modules & imports"
description: "Split Chuchu programs into files, export functions and records, and resolve relative imports."
---

Each `.chuchu` file is one module. Use `use module` to load another file and
`export` to make a function or record available to its importers.

## A two-file program

Save these files in the same directory:

```chuchu title="math.chuchu"
module math

export record Point {
    x: int
    y: int
}

export function add(a: int, b: int) be int {
    return a + b
}
```

```chuchu title="main.chuchu"
use module math

assign origin as math.Point {
    x: 0
    y: 0
}
show math.add(2, 3)
show origin.x
```

Compile the entry file; Cheeku discovers its dependencies automatically:

```sh
cheeku main.chuchu -o program
./program
```

Output: `5`, then `0`. On Windows, use `-o program.exe` and run `program.exe`.
All reachable files are checked and linked into one executable.

## File layout and names

- Imported files must begin with `module name`. The entry file may omit it.
- Put `use module` statements after the optional module declaration and before
  other declarations or executable statements.
- `use module math` loads `math.chuchu` relative to the **importing file's
  directory**, independent of the program's working directory.
- `use module geometry.math` loads `geometry/math.chuchu` and exposes the final
  component as `math`: call `math.add(...)`, not `geometry.math.add(...)`.
- Do not add quotes, an extension, or an alias. The imported file's module
  declaration supplies a descriptive name; access uses the import's final component.
- Imported files contain function and record declarations, with optional imports;
  executable top-level statements belong in the entry file.

Each canonical file is loaded once, even if several modules import it.
Existing single-file programs need no module declaration or exports.

## Public and private declarations

Declarations are private unless marked `export function` or `export record`.
A public function may call a private helper in its own module. Importers can only
access exported members, using `module.member`.

Qualified record types work in initializers and function signatures:

```chuchu title="geometry.chuchu"
module geometry
use module math

export function move_right(point: math.Point) be math.Point {
    reassign point.x as point.x + 1
    return point
}
```

Exported signatures and exported record fields must use public record types.
Two records declared in different modules are distinct types even when their
fields match. Records keep their [value semantics](records.md#copies-have-value-semantics)
across function and module boundaries.

## Diagnostics and limits

Missing files, unknown or private members, circular imports, and duplicate names
produce diagnostics with source locations and import context. Used module names
and top-level declarations must have unique names within their module.

`module`, `use`, and `export` are reserved keywords. There are no package
registries, wildcard imports, aliases, re-exports, exported variables, or
executable library initialization.

File-based compiler APIs resolve imports automatically. The named-source API
requires entry text that matches its file on disk. Unnamed source-string APIs
reject imports because they have no base directory; see [compiler APIs](../project/architecture.md#library-entry-points).

The [repository example](https://github.com/chuchu-lang/chuchu-core/tree/main/examples/modules)
combines imported records, exported functions, and private helpers. Compile
`examples/modules/main.chuchu`; it prints `5`, `3`, and `5`.
