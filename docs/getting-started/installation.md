---
title: "Installation"
description: "Build Cheeku on macOS, Linux x64 GNU, or Windows x64 MSVC with Rust and the pinned LLVM 23.1 toolchain."
---

Cheeku is a host-native compiler for macOS (Apple Silicon or Intel), Linux x64
GNU, and Windows x64 MSVC. It does not provide cross-OS compilation. See
[platform validation](../project/status.md#platform-validation) for current
compiler, string, and debugger evidence.

## Requirements

Install Git, [Rust through rustup](https://rustup.rs/), and Python 3.12 or newer.
Rust 1.88+ is the crate minimum. The setup below selects Rust 1.99.1 and LLVM
23.1.4 to match the repository's pinned CI toolchain. The compiler's Inkwell
configuration requires LLVM **23.1.x**.

Clone the compiler repository:

```bash
git clone https://github.com/chuchu-lang/chuchu-core.git
cd chuchu-core
```

Run the following setup for your host from that directory. LLVM provisioning
checks downloaded archives and builds from source on macOS and Windows. The
first run can take considerable time; keep the SDK directory for later builds.

## macOS

Install Xcode command line tools and the source-build prerequisites:

```bash
xcode-select --install
brew install python cmake ninja
rustup toolchain install 1.99.1 --profile minimal --component rustfmt,clippy
rustup override set 1.99.1
```

Provision LLVM and configure the current terminal:

```bash
python3 .github/scripts/provision-llvm.py --directory "$PWD/target/llvm-sdk"
export LLVM_SYS_231_PREFIX="$(cat target/llvm-sdk/prefix.txt)"
"$LLVM_SYS_231_PREFIX/bin/llvm-config" --version
xcrun clang --version
```

LLVM should report `23.1.4`. Do not set `DYLD_LIBRARY_PATH`; the compiler's build
script configures its LLVM library search path. An already-installed compatible
Homebrew LLVM can also be selected with `LLVM_SYS_231_PREFIX`, but check that its
reported version is 23.1.x rather than assuming an unversioned package matches.

## Linux

For Ubuntu/Debian, install the native linker and SDK dependencies. Other
GNU-based distributions need equivalent packages. Ensure Python is 3.12+.

```bash
sudo apt-get update
sudo apt-get install -y git build-essential clang python3 libtinfo6 libxml2-dev libzstd-dev zlib1g-dev xz-utils
rustup toolchain install 1.99.1 --profile minimal --component rustfmt,clippy
rustup override set 1.99.1
python3 .github/scripts/provision-llvm.py --directory "$PWD/target/llvm-sdk"
export LLVM_SYS_231_PREFIX="$(cat target/llvm-sdk/prefix.txt)"
export PATH="$LLVM_SYS_231_PREFIX/bin:$PATH"
export LD_LIBRARY_PATH="$LLVM_SYS_231_PREFIX/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
"$LLVM_SYS_231_PREFIX/bin/llvm-config" --version
clang --version
```

LLVM should report `23.1.4`. This target uses GNU/Linux and the host C library;
Android and musl Linux are not part of the current target matrix.

## Windows

Install Git, Python 3.12+, Rust's x64 MSVC toolchain, and Visual Studio Build
Tools with **Desktop development with C++**, the x64 MSVC tools, and a Windows
SDK. Open **x64 Developer PowerShell for Visual Studio** so linker libraries are
available, then run:

```powershell
rustup toolchain install 1.99.1-x86_64-pc-windows-msvc --profile minimal --component rustfmt,clippy
rustup override set 1.99.1-x86_64-pc-windows-msvc
python -m pip install cmake ninja
python .github/scripts/provision-llvm.py --directory "$PWD/target/llvm-sdk"
$env:LLVM_SYS_231_PREFIX = (Get-Content target/llvm-sdk/prefix.txt).Trim()
$env:PATH = "$env:LLVM_SYS_231_PREFIX\bin;$env:PATH"
& "$env:LLVM_SYS_231_PREFIX\bin\llvm-config.exe" --version
clang-cl.exe --version
```

LLVM should report `23.1.4`. The small LLVM installer alone is insufficient for
this Rust compiler build; use the repository's SDK provisioner.

## Build and install Cheeku

After configuring your host toolchain:

```bash
cargo build --locked --release
cargo test --locked
```

The compiler is `target/release/cheeku` on macOS/Linux and
`target\release\cheeku.exe` on Windows. Check it with `--help`.

To install the `cheeku` command on your Cargo binary path:

```bash
cargo install --path . --locked
cheeku --help
```

Keep `LLVM_SYS_231_PREFIX` set for builds, tests, and installation. In a new
terminal, reapply the host-specific environment assignments. On Windows, reopen
the x64 developer shell. Add Cargo's binary directory to `PATH` when necessary.

## Compile the included example

On macOS/Linux:

```bash
./target/release/cheeku examples/main.chuchu -o target/hello
./target/hello
```

On Windows:

```powershell
.\target\release\cheeku.exe examples/main.chuchu -o target/hello.exe
.\target\hello.exe
```

Output: `35`. Compilation and execution are separate steps. The default output
is `main` on macOS/Linux and `main.exe` on Windows. An explicit `-o` preserves the
filename; include `.exe` yourself for normal Windows execution.

Try `examples/strings.chuchu` for UTF-8 text, or follow
[native debugging](../tooling/debugging.md) to build with source symbols.

## Troubleshooting installation

| Symptom | Check |
|---|---|
| LLVM cannot be found | Set `LLVM_SYS_231_PREFIX`; confirm `llvm-config` reports 23.1.x. |
| Clang cannot start | Check `xcrun clang` on macOS, `clang` on Linux, or `clang-cl.exe` and the x64 developer environment on Windows. |
| Windows linker libraries are missing | Install the C++ tools/SDK and reopen x64 Developer PowerShell. |
| `cheeku` is not found | Use the release binary path or add Cargo's binary directory to `PATH`. |
| Native output fails on another machine | Build on the destination OS/architecture; avoid `--cpu native` when host-specific features are unwanted. |
| A locked Windows executable cannot be replaced | Stop the process using the output and compile again; the existing file is retained on failure. |

**Next:** [Write your first program](first-program.md).
