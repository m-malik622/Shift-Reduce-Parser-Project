import { create } from "zustand";
import GrammarRule from "../Utils/GrammarRule";

interface GrammarRulesProps {
  grammarRules: GrammarRule[]
  addGrammarRule: (RuleToAdd: GrammarRule | null) => void
  removeGrammarRule: (index: Number) => void
  removeAllGrammarRules: () => void
}


export const useGrammarRuleStore = create<GrammarRulesProps>((set) => ({
  grammarRules: [
    new GrammarRule("E -> E + T"),
    new GrammarRule("E -> T"), 
    new GrammarRule("T -> T * F"), 
    new GrammarRule("T -> F"), 
    new GrammarRule("F -> ( E )"), 
    new GrammarRule("F -> id")],
  addGrammarRule: (RuleToAdd) => {set((state) => {
      const newRule = RuleToAdd ?? new GrammarRule(null);
      const newGrammar = [...state.grammarRules, newRule];
      return { grammarRules: newGrammar };
    });
  },
  removeGrammarRule: (index) => {set((state) => {
      const newGrammar = state.grammarRules.filter((_, i) => i !== index);
      return { grammarRules: newGrammar };
    });
  },
  removeAllGrammarRules: () => set({ grammarRules: [] }),
}))