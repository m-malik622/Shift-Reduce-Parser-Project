import { useGrammarRuleStore } from '../store/GrammarRulesStore';
import GrammarRule from './GrammarRule';
// basic token splitter


export function splitTokens(text: string, grammarRules: GrammarRule[]) {
  if (!text) throw new Error(`Cannot compile ""`);
  //gather terminal tokens 
    const before_arrow_symbols = new Set<string>()
    for (const rule of grammarRules){
      rule.get_after_arrow().split(" ").forEach(token => before_arrow_symbols.add(token));
    }
    const after_arrow_symbols = new Set<string>()
    for (const rule of grammarRules){
      rule.get_before_arrow().split(" ").forEach(token => after_arrow_symbols.add(token));
    }
    const terminals = new Set<string>([...before_arrow_symbols, ...after_arrow_symbols]); 

    let tokens = [];
    
    let buf = "";
    for (let c = 0; c < text.length; c++) {
        let char = text.charAt(c);

        // skip whitespace
        if (char == '\t' || char == '\r' || char == '\n' || char == " ")
            continue;
        
        buf += char;

        if (terminals.has(buf)) {
            tokens.push(buf);
            buf = "";
        }
    }

    if (buf.length != 0)
        throw new Error(`splitTokens: unrecognized token '${buf}'`);
    return tokens;
}