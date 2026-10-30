import original from "@theme-original/prism-include-languages";
import { chuchuGrammar } from "./chuchu-language";

export default function includeLanguages(Prism: typeof import("prismjs")) {
  original(Prism);
  Prism.languages.chuchu = chuchuGrammar;
}
