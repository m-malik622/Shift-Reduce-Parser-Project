import { useContext, useState } from "react";
import GrammarRule from "../Utils/GrammarRule";
import GrammarInput from "./GrammarInput";
import { useGrammarRuleStore } from "../store/GrammarRulesStore";

const GrammarEditor = () => {
  const grammarRules = useGrammarRuleStore((state) => state.grammarRules);
  const addGrammarRule = useGrammarRuleStore((state) => state.addGrammarRule);
  const removeGrammarRule = useGrammarRuleStore(
    (state) => state.removeGrammarRule
  );
  const removeAllGrammarRules = useGrammarRuleStore(
    (state) => state.removeAllGrammarRules
  );

  return (
    <div>
      <h2>Grammar Rule Set</h2>
      <div>
        {grammarRules.map((rule, index) => (
          <div key={index}>
            <GrammarInput />
            <p>index: {index}</p>
            <button
              className="delete-rule"
              onClick={() => removeGrammarRule(index)}
            >
              Remove Rule
            </button>
          </div>
        ))}
      </div>
      <div>
        <button className="AddGrammarRule" onClick={() => addGrammarRule(null)}>
          Add Rule
        </button>
      </div>
    </div>
  );
};
export default GrammarEditor;
