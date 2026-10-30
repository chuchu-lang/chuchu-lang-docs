import original from "@theme-original/prism-include-languages";
export default function includeLanguages(Prism: typeof import("prismjs")) {
  original(Prism);
  Prism.languages.chuchu = {
    string: { pattern: /"(?:\\[^\r\n]|[^"\\\r\n])*"/, greedy: true },
    keyword: /\b(?:assign|show|reassign|if|else|while|function|return|err)\b/,
    boolean: /\b(?:true|false)\b/,
    "class-name": /\b(?:int|float|bool|string|result)\b/,
    builtin: /\b(?:abs|sqrt|min|max|sum|len|read_line|parse_int|parse_float|to_string|ok|is_ok|is_eof|error_code|error_message|unwrap)(?=\s*\()/,
    function: /\b[a-zA-Z_]\w*(?=\s*\()/,
    number: /\b\d+(?:\.\d*)?(?:[eE][+-]?\d+)?\b/,
    operator: /->|==|!=|<=|>=|[+*/=<>-]/,
    punctuation: /[{}[\](),:]/,
  };
}
