import React, { type RefObject } from "react";
import { motion } from "motion/react";
import { useGrammarRuleStore } from "../store/GrammarRulesStore";
interface GrammarRulesDisplayProps {
  ref: React.RefObject<HTMLTableElement | null>; // false if for stack
}
const GrammarRulesDisplay: React.FC<GrammarRulesDisplayProps> = ({ ref }) => {
    const grammarRules = useGrammarRuleStore((state) => state.grammarRules);

  return (
    <div className="grammar-table-container">
      <table className="grammar-table" ref={ref}>
        <thead>
          <tr>
            <th>#</th>
            <th>Grammar Rule</th>
          </tr>
        </thead>
        <tbody>
          {grammarRules.map((rule, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>
                {rule.get_before_arrow()} → {rule.get_after_arrow()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GrammarRulesDisplay;
