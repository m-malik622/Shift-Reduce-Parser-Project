import { useEffect, useRef, useState } from "react";
import GrammarRule from "../Utils/GrammarRule";
import GrammarInput from "./GrammarInput";
import GrammarEditor from "./GrammarEditor";
import ShiftReduceParserTable from "./ShiftReduceParserTable";
import InputEditor from "./InputEditor";
import GrammarRulesDisplay from "./GrammarRulesDisplay";
import { useGrammarRuleStore } from "../store/GrammarRulesStore";
import { useIsCompilingStore } from "../store/IsCompilingStore";
import { useUserInputStore } from "../store/UserInputStore";
import { useParserStateStore } from "../store/ParserStateStore";
import StackTable from "./StackTable";
import ControlPanel from "./ControlPanel";
import ParsingState from "../Utils/ParsingState";
import { AnimatePresence, motion, MotionConfig } from "motion/react";

const ParserPage = () => {
  const isCompiling = useIsCompilingStore((state) => state.isCompiling);
  const parserStateHistory = useParserStateStore(
    (state) => state.parserStateHistory
  );
  const parserStateHistoryIterator = useParserStateStore(
    (state) => state.parserStateHistoryIterator
  );

  const currentParsingState = parserStateHistory[parserStateHistoryIterator];
  const parserTableRef = useRef<HTMLTableElement | null>(null);
  const grammarRuleRef = useRef<HTMLTableElement | null>(null);
  //change whats highlihgted on parser table based on current state
  useEffect(() => {
    if (!currentParsingState) return;
    const currUserInput = currentParsingState
      .get_user_input_content()
      .slice(-1)[0];
    const currentStack = currentParsingState.get_stack_content().slice(-1)[0];
    const parserTable = parserTableRef.current;
    const grammarRuleTable = grammarRuleRef.current;

    if (!currUserInput || !currentStack || !parserTable || !grammarRuleTable)
      return;
    //clear existing highlights before marking new ones
    parserTable
      .querySelectorAll("td")
      .forEach((td) => td.classList.remove("highlight"));
    grammarRuleTable
      .querySelectorAll("td")
      .forEach((td) => td.classList.remove("highlight"));

    // Find the col from user input top
    const headers = parserTable.querySelectorAll("thead th");
    let colIndex = -1;
    headers.forEach((th, idx) => {
      if (th.textContent === currUserInput) {
        colIndex = idx;
      }
    });
    // Find the row from stack top
    const rows = parserTable.querySelectorAll("tbody tr");
    let rowIndex = -1;
    rows.forEach((tr, idx) => {
      const firstCell = tr.querySelector("td");
      if (firstCell && firstCell.textContent === currentStack) {
        rowIndex = idx;
      }
    });
    if (rowIndex === -1 || colIndex === -1) return;
    // Update highlighting of table
    const targetCell = rows[rowIndex].querySelectorAll("td")[colIndex];
    if (targetCell) {
      targetCell.classList.add("highlight");
    }
    // Update highlighting of grammar rule if applicable
    if (targetCell.textContent?.includes("r")) {
      const grammarRuleIndex = parseInt(
        targetCell.textContent.substring(1),
        10
      );
      const rows = grammarRuleTable.querySelectorAll("tbody tr");
      // Highlight the corresponding grammar rule row
      const targetRuleRow = Array.from(rows).find((tr) => {
        const firstCell = tr.querySelector("td");
        return firstCell?.textContent === grammarRuleIndex.toString();
      });
      if (targetRuleRow) {
        const cells = targetRuleRow.querySelectorAll("td");
        cells.forEach((td) => td.classList.add("highlight"));
      }
    }
  }, [currentParsingState]);

  return (
    <>
      <div className="setup">
        {!isCompiling && (
          <>
            <GrammarEditor />
            <InputEditor />
          </>
        )}
      </div>
      {isCompiling && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="main"
        >
          <AnimatePresence>
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-row justify-center gap-3">
                <StackTable
                  isInput={true}
                  contents={currentParsingState.get_user_input_content()}
                />
                <StackTable
                  isInput={false}
                  contents={currentParsingState.get_stack_content()}
                />
              </div>
              <GrammarRulesDisplay ref={grammarRuleRef} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="control-panel">
                <ControlPanel />
              </div>
              <div>
                <ShiftReduceParserTable ref={parserTableRef} />
              </div>
            </div>
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
};

export default ParserPage;
