import { motion } from "motion/react";
import React, { useEffect, type RefObject } from "react";
import { buildParsingTable } from "../Utils/TableGeneration";
import { useGrammarRuleStore } from "../store/GrammarRulesStore";
import { useParsingTableStore } from "../store/ParsingTableStore";

interface ShiftReduceParserTableProps {
  ref: RefObject<HTMLTableElement | null>; // false if for stack
}
const ShiftReduceParserTable: React.FC<ShiftReduceParserTableProps> = ({ ref }) => {
  const grammarRules = useGrammarRuleStore((state) => state.grammarRules);
  const header = useParsingTableStore((state) => state.header);
  const setHeader = useParsingTableStore((state) => state.setHeader);
  const rows = useParsingTableStore((state) => state.rows);
  const setRows = useParsingTableStore((state) => state.setRows);
  const create_parser_table_dictionary = useParsingTableStore((state) => state.create_parser_table_dictionary);

  useEffect(() => {
    const { action, goto, states } = buildParsingTable(grammarRules);
    const terminals = new Set<string>();
    const nonTerminals = new Set<string>();

    action.forEach((row) => row.forEach((_, t) => terminals.add(t)));
    goto.forEach((row) => row.forEach((_, nt) => nonTerminals.add(nt)));

    const termCols = [...terminals].sort();
    const nonTermCols = [...nonTerminals].sort();

    const header = ["state", ...termCols, "", ...nonTermCols];

    const rows = states.map((_, state) => {
      const termCells = termCols.map((t) => action.get(state)?.get(t) ?? "");
      const nonTermCells = nonTermCols.map(
        (nt) => goto.get(state)?.get(nt) ?? ""
      );
      return [state, ...termCells, "|", ...nonTermCells];
    }).map(row => row.map(cell => typeof cell === "number" ? String(cell) : cell));

    setHeader(header);
    setRows(rows);
    create_parser_table_dictionary();
  }, [grammarRules]);

  return (
    <motion.div initial>
      <motion.table className="shift-reduce-table" ref={ref}>
        <thead>
          <tr>
            {header.map((h, idx) => (
              <th key={idx}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, cidx) => (
                <td key={cidx}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </motion.table>
    </motion.div>
  );
};

export default ShiftReduceParserTable;
