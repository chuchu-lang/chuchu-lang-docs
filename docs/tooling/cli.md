---
title: "Compiler CLI"
description: "Reference every Cheeku compiler flag: optimization, output paths, debug builds, CPU policy, timings, LLVM IR, and assembly."
---

```text
cheeku <source.chuchu> [--debug|-g] [-O0|-O1|-O2|-O3] [-o <executable>] [--cpu generic|native] [--time-compilation] [--emit-ir <file>] [--emit-assembly <file>] [--no-vectorize]
```

The input must have a `.chuchu` extension. Options follow the source path; output and optimization flags can appear in either order. Unknown flags and repeated options are errors.

| Option | Default | Purpose |
|---|---|---|
| `-o <path>` | `main` on macOS/Linux; `main.exe` on Windows | Executable destination |
| `--debug` | Off | Full symbols; O0 unless an explicit `-O*` is supplied |
| `-g` | Off | Full symbols at the selected optimization level |
| `-O0`, `-O1`, `-O2`, `-O3` | `-O2` | Optimization level |
| `--cpu generic` | Selected | Generic CPU for detected host architecture |
| `--cpu native` | Off | Host-specific CPU/features |
| `--time-compilation` | Off | Stage timing JSON on stderr |
| `--emit-ir <path>` | Off | LLVM IR after optional optimization |
| `--emit-assembly <path>` | Off | Target assembly |
| `--no-vectorize` | Off | Disable loop/SLP vectorizer and interleaving options |
| `--help`, `-h` | — | Print usage when passed alone |

Prefer building from your editor? The [VS Code extension](vscode.md#build-the-current-file) runs Cheeku for the current file and reports compiler errors in the Problems panel.

## Compile and run

```bash
cheeku hello.chuchu -O2 -o hello
./hello
```

Compilation does not execute the program. Paths containing spaces are supported when quoted in your shell:

```bash
cheeku "my source.chuchu" -o "my program"
./"my program"
```

## Debug builds

```bash
cheeku hello.chuchu --debug -o hello_debug
lldb ./hello_debug
```

`--debug` defaults to O0, while `-g` leaves the default O2 or an explicitly
selected level in place. An explicit `-O*` overrides the `--debug` profile in
either argument order. Use an `.exe` output on Windows. Symbol sidecars and
LLDB/editor setup are covered in [native debugging](debugging.md).

## Inspect generated code

```bash
cheeku numerical.chuchu -O3 --emit-ir numerical.ll --emit-assembly numerical.s -o numerical
```

Artifact paths, including generated symbol sidecars, must differ from the input and each other. Existing source/artifact aliases are checked using path normalization and canonicalization.

## Compilation timing

```bash
cheeku hello.chuchu --time-compilation -o hello
```

One JSON object is written to stderr after success. Values are measured seconds:

| Key | Stage |
|---|---|
| `lex_s` | Tokenization |
| `parse_s` | Parsing |
| `type_s` | Type checking |
| `ir_s` | LLVM generation and its verification |
| `target_setup_s` | Native target configuration |
| `optimization_s` | Optional passes and verification |
| `object_s` | Final verification and object emission/write |
| `link_s` | Linking, symbol finalization and artifact publication |
| `total_s` | Compiler API work |

Total time need not equal the sum of stages. CLI process startup and timing output are outside API total. See [performance](performance.md) for measurement details.

## Exit behavior

`--help` and successful compilation return status `0`. Argument or compilation failures return a failure status and print a diagnostic. Generated runtime check failures separately return status `1` when the executable runs.
