---
title: "File I/O"
description: "Read and write whole UTF-8 text files and recover from file errors with Chuchu results."
---

Chuchu provides four built-ins for whole UTF-8 text files:

| Function | Returns | On failure |
| --- | --- | --- |
| `read_file(path)` | `string` containing the complete file | Prints a runtime diagnostic and exits 1 |
| `try_read_file(path)` | `result<string>` | Returns an error result |
| `write_file(path, text)` | `int` counting bytes written | Prints a runtime diagnostic and exits 1 |
| `try_write_file(path, text)` | `result<int>` counting bytes written | Returns an error result |

Paths and text must be strings. There is no implicit conversion; use `to_string`
for numbers or booleans. All four names are reserved for function declarations.

## Read and write text

```chuchu
assign bytes as write_file("greeting.txt", "Hello, world 🌍")
show bytes
assign text as read_file("greeting.txt")
show text
show length(text)
```

```text title="Output"
17
Hello, world 🌍
14
```

`write_file` counts UTF-8 **bytes**; `length` counts Unicode scalar values.
The globe takes four bytes but counts as one scalar.

Writing creates a file or replaces all its existing contents. Missing parent
directories are not created. No newline or byte-order mark is added. Writing
`""` leaves an empty file. Bind the return value even when you do not need it;
standalone calls such as `write_file("a.txt", "text")` are not valid statements.

Reading an empty file succeeds with `""`. Contents must be valid UTF-8 without
NUL bytes. Reads preserve line endings, trailing newlines, and a UTF-8 byte-order
mark. Unlike `input()`, they do not strip a line ending.

## Recover from failures

Use the same [result operations](input-results.md#result-values) as input and
numeric conversions:

```chuchu
assign settings as try_read_file("settings.txt")
if is_ok(settings) {
    show unwrap(settings)
} else {
    show "Could not read settings.txt: " + error_message(settings)
    show error_code(settings)
}
assign saved as try_write_file("settings.txt", "volume=7")
if is_ok(saved) {
    show "Saved " + to_string(unwrap(saved)) + " bytes"
} else {
    show error_message(saved)
}
```

File calls reuse the existing error codes:

| Code | Meaning for files |
| --- | --- |
| 0 | Success |
| 3 | File size arithmetic would overflow |
| 4 | Open, read, write, or close failed; includes missing files/directories, permission errors, and full disks |
| 5 | File contents are not valid UTF-8 |
| 6 | File contents contain a NUL byte |
| 7 | Memory allocation failed |

Codes 1 (EOF) and 2 (invalid number) are never returned by file calls.
`is_eof` is always false for their results. NUL is detected before invalid UTF-8.
Error messages are shared with input, so codes 5 and 6 still say “Input”.
A missing file and a permission error both return code 4; the API cannot
reliably distinguish them.

Plain `read_file` and `write_file` stop on failure with a diagnostic on stderr
including the failing call's byte span. Use the `try_` forms when recovery is needed.

## Paths and platform behavior

- Relative paths resolve against the **running program's working directory**,
  rather than the source or executable directory.
- Absolute paths are used as given. `~`, environment variables, and wildcards
  are literal text; no shell expansion occurs.
- Spaces and Unicode names are supported. Windows paths are converted to UTF-16.
- Forward slashes work on every target. Escape a backslash in a string as `\\`.
- Symbolic links are followed. Empty paths fail with code 4.
- File contents are read and written byte for byte on every platform. `show`
  adds its own host newline after the text.

## Storage and limits

Strings and results are owned values and cleaned up automatically. Each call
opens and closes its file before returning; no file handle is left open between
calls. Arguments are evaluated left to right before writing begins, so
`write_file("same.txt", read_file("same.txt"))` reads before truncation.

Only whole text files are supported. There is no binary mode, streaming,
seeking, append API, file existence test, delete, rename, directory listing,
or directory creation. Read and concatenate text before rewriting if you need
to append, and handle read failures before replacing existing data.

Writes are not atomic: a failure can leave a file truncated or partly written.
There is no file locking or configured file size limit beyond available memory.

The [runnable file example](https://github.com/chuchu-lang/chuchu-core/blob/main/examples/files.chuchu)
shows writing, reading, overwriting, and recovery from a missing file. It creates
`chuchu-files-example.txt` in the directory where you run it.
