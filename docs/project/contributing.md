---
title: "Contributing"
description: "Contribute to the Chuchu compiler or documentation, run validation, and write implementation-backed examples."
---

Chuchu is open source. Contributions can improve language behavior, diagnostics, examples, or documentation.

- [Compiler repository](https://github.com/chuchu-lang/chuchu-core)
- [Documentation repository](https://github.com/chuchu-lang/chuchu-lang-docs)

## Work on the compiler

Follow the [installation guide](../getting-started/installation.md), then run from `chuchu-core`:

```bash
cargo fmt --all -- --check
cargo build --locked
cargo test --locked
cargo clippy --locked --all-targets -- -D warnings
cargo build --locked --release
```

The shared native suites run on the four host targets in CI. Tests compile and
execute programs; retain the O0–O3 behavior matrix. Run the debugger smoke test
with LLDB installed:

```bash
python3 .github/scripts/debugger-smoke.py --compiler target/release/cheeku
```

For string storage changes, use a compatible Clang 23+ driver:

```bash
python3 .github/scripts/string-memory-smoke.py --compiler target/release/cheeku --clang /path/to/clang --sanitize
```

This checks allocation balance, bounded live storage, allocation failures, and
lifetimes under AddressSanitizer. A passing local suite validates that host;
check target-specific CI results before claiming compatibility elsewhere.

For benchmark harness changes:

```bash
python3 -m unittest discover -s benchmarks -p test_runner.py
```

Performance experiments belong in separate benchmark runs, outside ordinary correctness checks.

## Work on the documentation

Use Node.js 22 or newer; the repository's `.nvmrc` selects Node 24.

```bash
git clone https://github.com/chuchu-lang/chuchu-lang-docs.git
cd chuchu-lang-docs
npm ci
npm start
```

Before submitting changes:

```bash
npm run check
```

This type-checks the site and builds production pages. Broken internal links and anchors fail the build. Search indexing is generated during production builds; use `npm run serve` after a build to test it.

## Writing guidance

Use Markdown files in `docs/`, give each page a specific title and description, and add new reference pages to `sidebars.ts`. Keep examples executable with the current compiler. Explicitly label invalid code and historical benchmark results.

Do not document planned features as available. When changing language semantics, update examples, reference text, and relevant compiler tests together. Each page's edit link opens its source on GitHub.
