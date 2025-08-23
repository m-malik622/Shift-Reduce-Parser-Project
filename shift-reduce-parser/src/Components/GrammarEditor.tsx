import { useContext, useState } from "react";
import GrammarRule from "../Utils/GrammarRule";
import GrammarInput from "./GrammarInput";
import { useGrammarRuleStore } from "../store/GrammarRulesStore";
import { motion } from "motion/react";
const GrammarEditor = () => {
  const grammarRules = useGrammarRuleStore((state) => state.grammarRules);
  const addGrammarRule = useGrammarRuleStore((state) => state.addGrammarRule);
  const removeGrammarRule = useGrammarRuleStore(
    (state) => state.removeGrammarRule
  );

  return (
    <>
      <h2>Grammar Rule Set</h2>
      <div className="grammar-editor">
        {grammarRules.map((rule, index) => (
          <div
            key={`${index}-${rule.get_before_arrow()}-${rule.get_after_arrow()}`}
          >
            <GrammarInput
              text={`${rule.get_before_arrow()} -> ${rule.get_after_arrow()}`}
            />
            <motion.button
              className="delete-rule"
              onClick={() => {
                console.log("removing index:", index);
                console.log("gramar rules before:", grammarRules);
                removeGrammarRule(index);
                console.log("gramar rules after:", grammarRules);
              }}
              whileHover={{
                scale: 1.2,
                transition: { duration: 1 },
              }}
              whileTap={{ scale: 0.9 }}
            >
              Remove Rule
            </motion.button>
          </div>
        ))}
      </div>
      <div>
        <motion.button
          className="AddGrammarRule"
          onClick={() => addGrammarRule(null)}
          whileHover={{
            scale: 1.2,
            transition: { duration: 1 },
          }}
          whileTap={{ scale: 0.9 }}
        >
          Add Rule
        </motion.button>
      </div>
    </>
  );
};
export default GrammarEditor;
