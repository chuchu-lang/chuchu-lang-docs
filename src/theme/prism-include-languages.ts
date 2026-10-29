import original from "@theme-original/prism-include-languages";
export default function includeLanguages(Prism: typeof import("prismjs")) {
  original(Prism);
  Prism.languages.chuchu = {
    string: { pattern: /"(?:\\[^\r\n]|[^"\\\r\n])*"/, greedy: true },
    keyword: /\b(?:assign|show|reassign|if|else|while|function|return)\b/,
    boolean: /\b(?:true|false)\b/,
    "class-name": /\b(?:int|float|bool|string)\b/,
    builtin: /\b(?:abs|sqrt|min|max|sum|len)(?=\s*\()/,
    function: /\b[a-zA-Z_]\w*(?=\s*\()/,
    number: /\b\d+(?:\.\d*)?(?:[eE][+-]?\d+)?\b/,
    operator: /->|==|!=|<=|>=|[+*/=<>-]/,
    punctuation: /[{}[\](),:]/,
  };
}
