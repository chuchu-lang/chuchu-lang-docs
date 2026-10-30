const commentKeywords = ["TODO", "NOTE", "CRITICAL", "FIXME", "WARNING", "HACK", "DONE"];

export const chuchuGrammar = {
  ...Object.fromEntries(commentKeywords.map((keyword) => [
    `comment-${keyword.toLowerCase()}`,
    {
      pattern: new RegExp(String.raw`//[ \t]*${keyword}:[^\r\n]*|/\*[ \t\r\n]*${keyword}:[\s\S]*?(?:\*/|$)`),
      greedy: true,
      alias: "comment",
    },
  ])),
  comment: { pattern: /\/\/[^\r\n]*|\/\*[\s\S]*?(?:\*\/|$)/, greedy: true },
  string: { pattern: /"(?:\\[^\r\n]|[^"\\\r\n])*"/, greedy: true },
  keyword: /\b(?:assign|as|show|reassign|if|else|while|function|be|return|err)\b/,
  boolean: /\b(?:true|false)\b/,
  "class-name": /\b(?:int|float|bool|string|result)\b/,
  builtin: /\b(?:abs|sqrt|min|max|sum|len|input|try_input|parse_int|parse_float|to_string|ok|is_ok|is_eof|error_code|error_message|unwrap)(?=\s*\()/,
  function: /\b[a-zA-Z_]\w*(?=\s*\()/,
  number: /\b\d+(?:\.\d*)?(?:[eE][+-]?\d+)?\b/,
  operator: /==|!=|<=|>=|[+*/=<>-]/,
  punctuation: /[{}[\](),:]/,
};
