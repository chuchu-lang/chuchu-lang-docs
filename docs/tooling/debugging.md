---
title: "Native debugging"
description: "Build Chuchu programs with source symbols, inspect variables in LLDB, and understand platform debug artifacts and editor setup."
---

Cheeku emits LLVM debug information for source breakpoints, stepping, stack
frames, parameters, and local variables. LLDB controls the compiled executable.

## Build a debug program

Save this complete program as `counter.chuchu`:

```chuchu
assign counter as 0
assign message as "Counting"
while counter < 3 {
    show message
    show counter
    reassign counter as counter + 1
}
```

Compile and start LLDB:

```bash
cheeku counter.chuchu --debug -o counter
lldb ./counter
```

On Windows use `-o counter.exe` and launch LLDB with `counter.exe`. LLDB and
`lldb-dap` are separate dependencies; the compiler SDK is not assumed to include
them. On macOS, Xcode command line tools provide LLDB. Install a debugger with
Python scripting support to run the project's debugger regression script.

`--debug` enables full symbols and defaults to O0. An explicit `-O*` overrides
that profile in either argument order. `-g` adds symbols while retaining the
default O2 or selected optimization level. `-O0` alone does not add symbols.
Use O0 for predictable stepping and variable inspection; optimized code can
eliminate values or rearrange source operations.

## Break, step, and inspect

Run these commands inside LLDB:

```text
breakpoint set --file counter.chuchu --line 4
run
frame variable counter message
next
step
finish
bt
continue
quit
```

| Command | Action |
|---|---|
| `breakpoint set --file … --line …` | Stop at a source line |
| `frame variable …` | Inspect parameters or locals |
| `next` | Step over a statement or call |
| `step` | Step into a function call |
| `finish` | Run until the current function returns |
| `bt` | Show the call stack |
| `continue` | Resume execution |

A breakpoint stops before its statement executes. A breakpoint on a loop's
condition can fire on successive iterations. Top-level variables live in the
`main` frame; compiled user functions use `chuchu.<name>` symbols.

Integers, floats, booleans, numeric arrays, and strings have debug metadata.
LLDB may display native C type names; strings appear as character pointers
with text summaries. Chuchu watch expressions, conditional breakpoints, and
variable editing using Chuchu syntax are not implemented. Use `frame variable`
for inspection.

## Platform artifacts and evidence

| Target | Symbols |
|---|---|
| macOS ARM64 / Intel | Executable plus `<output>.dSYM` |
| Linux x64 GNU | DWARF retained in the executable |
| Windows x64 MSVC | Executable plus `<output>.pdb`, such as `counter.exe.pdb` |

Keep symbol sidecars beside the executable when moving or sharing a build.
On macOS, Cheeku runs dsymutil before deleting temporary objects. The optional
`CHEEKU_DSYMUTIL` environment variable selects one dsymutil executable path.

The latest string/debugger work passed 17 real LLDB assertions locally on
macOS ARM64, including relocation after temporary-file cleanup. The repository
has native tests for all four targets and LLDB smoke checks for macOS/Linux;
those checks must pass on the current revision before treating other targets as
validated. Windows real debugger sessions are not currently enforced by CI.

Source paths are absolute. Use the compiled source version, and configure your
debugger's source mapping if the source tree moves. An absolute-path breakpoint
should use the canonical source path, especially for macOS `/var` aliases.

## Editor integration

The [Chuchu VS Code extension](vscode.md) provides editing features and
**Chuchu: Build Current File for Debugging**. It uses your local Cheeku
compiler with `--debug`; a separate debugger extension controls the resulting
executable. For `counter.chuchu` in the workspace root, the extension writes
`.chuchu/build/counter-debug` (`counter-debug.exe` on Windows). When using that
build command, change `program` in the configuration below to
`${workspaceFolder}/.chuchu/build/counter-debug`, and its Windows override to
`${workspaceFolder}/.chuchu/build/counter-debug.exe`.

Use an editor that supports `lldb-dap`. With the official
[LLDB DAP extension](https://lldb.llvm.org/use/lldbdap.html) in VS Code, build
`counter` first and add this launch configuration:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Chuchu native debug",
      "type": "lldb-dap",
      "request": "launch",
      "program": "${workspaceFolder}/counter",
      "cwd": "${workspaceFolder}",
      "stopOnEntry": false,
      "windows": {
        "program": "${workspaceFolder}/counter.exe"
      }
    }
  ]
}
```

This is a starting configuration; an actual editor/DAP session has not yet been
validated for the latest implementation. No custom Chuchu adapter is required
to consume the native metadata.

Checked arithmetic, bounds, and string allocation failures print their existing
runtime diagnostics and exit with status 1. A debugger-specific stop hook for
these failures is future work. Syntax errors must be fixed before an executable
can be debugged; see [errors and diagnostics](../guides/errors.md).
