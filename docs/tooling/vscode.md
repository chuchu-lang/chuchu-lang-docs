---
title: "VS Code extension"
description: "Install Chuchu language support in VS Code, connect a locally built Cheeku compiler, and use completions, navigation, diagnostics, and build commands."
---

The [Chuchu Language extension](https://github.com/chuchu-lang/chuchu-vscode)
adds editing and build support for `.chuchu` files in **VS Code 1.96 or newer**.
Syntax highlighting, snippets, completions, hover help, navigation, and live
lexical diagnostics work without an installed compiler. To compile programs,
connect your local Cheeku executable.

## Install from a VSIX

You can build the installable extension directly from its repository. Use
Node.js 22 or newer:

```bash
git clone https://github.com/chuchu-lang/chuchu-vscode.git
cd chuchu-vscode
npm ci
npm run package
```

This creates `chuchu-vscode.vsix` in the repository root. In VS Code, open the
Extensions view, select **… → Install from VSIX…**, and choose that file.
If you already have a built VSIX, install it directly. With the VS Code CLI
available, you can also run:

```bash
code --install-extension chuchu-vscode.vsix
```

Open a `.chuchu` file to activate the extension. If VS Code asks you to reload
after installation or an update, reload the window.

## Connect a locally built compiler

Follow the [compiler installation guide](../getting-started/installation.md)
to build Cheeku and configure its LLVM and native linker dependencies. The
compiler does not need a published release. Its release executable is
`chuchu-core/target/release/cheeku` on macOS/Linux or
`chuchu-core/target/release/cheeku.exe` on Windows.

Open your project's folder in VS Code and set `chuchu.compilerPath` in
`.vscode/settings.json`. For sibling repositories inside a parent folder
named `chuchu-org`, the layout is:

```text
chuchu-org/
├── chuchu-core/
│   └── target/release/cheeku
└── chuchu-vscode/
```

Choose the path based on the folder you open in VS Code:

| Workspace folder | `chuchu.compilerPath` on macOS/Linux |
|---|---|
| `chuchu-org` | `./chuchu-core/target/release/cheeku` |
| `chuchu-vscode` | `../chuchu-core/target/release/cheeku` |
| `chuchu-core` | `./target/release/cheeku` |

For example, when opening `chuchu-org`:

```json title=".vscode/settings.json"
{
  "chuchu.compilerPath": "./chuchu-core/target/release/cheeku"
}
```

On Windows, append `.exe`. Forward slashes work in this setting, or escape
backslashes in an absolute path such as `C:\\projects\\chuchu-core\\target\\release\\cheeku.exe`.
For an unrelated project or a standalone file, use the absolute path to your
built compiler. Paths containing directories are resolved from the file's
workspace folder, or from the source directory when no workspace folder is
open. A bare executable name such as the default `cheeku` is resolved on PATH.
Pass only the executable path, without surrounding shell quotes or arguments.

A compiler built in release mode can produce both normal and debug programs.
If you built Cheeku itself with `cargo build` rather than `cargo build --release`,
use `target/debug` in the path instead.

## Edit and navigate

- **Highlighting and snippets:** keywords, types, strings, comments, functions,
  arrays, and results; snippets for declarations, functions, loops, input,
  and result handling.
- **Completions and hover:** keywords, built-ins, and visible document symbols,
  with built-in documentation and declared function signatures.
- **Signature help:** function parameters while typing calls, including nested
  calls and typed error construction with `err<T>(code)`.
- **Navigation:** Go to Definition, Find All References, occurrence highlighting,
  document outline, and folding.

Navigation follows declaration order, block shadowing, function parameter
scope, forward function calls, and the rule that functions cannot capture
variables declared at the top level. Navigation stays within the current
document; Chuchu does not have modules or imports yet.

## Build the current file

Open a saved `.chuchu` file in a trusted workspace. Use the editor's build
button or select a command in the Command Palette:

| Command | Compiler options | Output for `hello.chuchu` |
|---|---|---|
| **Chuchu: Build Current File** | `-O2` | `.chuchu/build/hello` |
| **Chuchu: Build Current File for Debugging** | `--debug` (O0 with native symbols) | `.chuchu/build/hello-debug` |

The extension saves pending edits before compiling. Output paths are relative
to the **source file's directory**; Windows executables also have an `.exe`
suffix. Add `.chuchu/` to your project's `.gitignore`. Compiler output appears
in the task terminal, and located compiler errors appear in the Problems panel.
See the [CLI reference](cli.md) for other compiler flags.

Compilation creates an executable. Run it separately in a terminal. For
`hello.chuchu` in your workspace root on macOS/Linux:

```bash
./.chuchu/build/hello
```

On Windows:

```powershell
.\.chuchu\build\hello.exe
```

A debug build produces native symbols, but the Chuchu extension does not bundle
a debugger. Use a separate LLDB-compatible debugger extension and point it at
the generated debug executable. See [native debugging](debugging.md#editor-integration).

## Diagnostics and current limits

Live editor diagnostics cover invalid characters, string escapes and literals,
numeric literals, unterminated comments, and unmatched delimiters. **Build with
Cheeku for complete syntax and type checking.** The editor analyzer is not the
compiler's full parser or type checker; inferred variables are labeled
“inferred by Cheeku” rather than displaying a guessed type.

Automatic formatting, rename, a standalone language server, and a bundled
debugger are not included. Editing features work in Restricted Mode and virtual
workspaces. Compiler tasks require a trusted workspace and a local filesystem.

| Setting | Default | Purpose |
|---|---|---|
| `chuchu.compilerPath` | `cheeku` | Compiler executable name or path |
| `chuchu.diagnostics.enable` | `true` | Enable live lexical and delimiter diagnostics |

## Troubleshooting

| Symptom | What to check |
|---|---|
| No Chuchu highlighting | Install the VSIX, open a `.chuchu` file, and check that its language mode is Chuchu. |
| Compiler cannot start | Verify `chuchu.compilerPath` names an executable. Relative paths depend on the folder opened as your workspace. |
| Compiler works in a terminal but not VS Code | Ensure VS Code has the toolchain environment from the [installation guide](../getting-started/installation.md). You can launch `code .` from that configured terminal; on Windows use the developer shell. |
| Builds are unavailable | Open a saved local `.chuchu` file and trust the workspace before running the compiler. |
| A type error has no live squiggle | Run **Chuchu: Build Current File**; full type diagnostics come from Cheeku. |
| Cannot find the executable | Look beside the source under `.chuchu/build/`; debug builds add `-debug`, and Windows adds `.exe`. |

Report extension issues in
[chuchu-vscode](https://github.com/chuchu-lang/chuchu-vscode/issues).
Include your VS Code version, operating system, compiler path, a minimal source
file, and the task output.
