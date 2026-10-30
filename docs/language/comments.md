---
title: "Comments"
description: "Write line and block comments, and highlight TODO, NOTE, CRITICAL, and other annotations."
---

## Line comments

`//` starts a comment that continues to the end of the line. Comments can appear
on their own line or after code:

```chuchu
//NOTE: Local variables infer their types.
assign count as 10 //TODO: Choose the initial count.
show count
```

## Block comments

`/*` starts a block comment and `*/` ends it. Block comments can span multiple
lines or appear between tokens:

```chuchu
/* This explanation
   spans multiple lines. */
assign count as 10
reassign count as count + /* adjustment */ 5
show count
```

Block comments end at the first `*/`; they do not nest. An unclosed block
comment is a compile error pointing to its opening `/*`.

Comments act as whitespace. Newlines inside block comments still separate
statements, so keep a comment inside an expression on one line. Comments do not
join adjacent tokens: `1/* comment */2` is two integers, not `12`.

Comment markers inside strings are literal text:

```chuchu
show "https://example.com"
show "These are text: /* and */"
```

## Colored annotations

Start a comment with an uppercase keyword followed by `:`. Optional spaces or
tabs may follow `//`; whitespace, including newlines, may follow `/*`. The
keyword must be the first content in the comment. The docs color the entire
comment, including all lines of an annotated block.

| Keyword | Color | Use |
| --- | --- | --- |
| `TODO:` | Amber | Work that remains |
| `NOTE:` | Blue | Context and explanations |
| `CRITICAL:` | Red | Essential correctness or safety requirements |
| `FIXME:` | Orange | A known bug to repair |
| `WARNING:` | Gold | A caveat or surprising behavior |
| `HACK:` | Purple | A temporary workaround |
| `DONE:` | Green | Completed work |

```chuchu
//TODO: Add another example.
//NOTE: The value is inferred as an integer.
//CRITICAL: Check is_ok before calling unwrap.
//FIXME: Replace the placeholder value.
//WARNING: Integer division discards the fractional part.
//HACK: Explain why a workaround is necessary.
//DONE: The example compiles and runs.
/*NOTE: This entire block is blue.
  Its annotation applies to every line.
*/
```

Ordinary comments use the default comment color. Lowercase keywords, unknown
keywords, and keywords later in a comment receive ordinary comment styling.
Annotations affect highlighting only: the compiler ignores every comment.
Other editors choose their own colors unless configured with this grammar.

See the complete [comments example](https://github.com/chuchu-lang/chuchu-core/blob/main/examples/comments.chuchu).
