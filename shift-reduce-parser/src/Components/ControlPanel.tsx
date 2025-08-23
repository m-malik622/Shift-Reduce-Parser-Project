import { AnimatePresence, motion } from "motion/react";
import { h2 } from "motion/react-client";
import React, { useState } from "react";
import { useIsCompilingStore } from "../store/IsCompilingStore";
import { useUserInputStore } from "../store/UserInputStore";
import { splitTokens } from "../Utils/Tokenizer";
import { useGrammarRuleStore } from "../store/GrammarRulesStore";
import { useParserStateStore } from "../store/ParserStateStore";
import { useParsingStatusStore } from "../store/ParsingStatusStore";
const ControlPanel = () => {
  const nextParserState = useParserStateStore((state) => state.nextParserState);
  const prevParserState = useParserStateStore((state) => state.prevParserState);
  const resetParserStateHistory = useParserStateStore(
    (state) => state.resetParserStateHistory
  );
  const setIsCompiling = useIsCompilingStore((state) => state.setIsCompiling);
  const parserStateHistory = useParserStateStore(
    (state) => state.parserStateHistory
  );
  const parserStateHistoryIterator = useParserStateStore(
    (state) => state.parserStateHistoryIterator
  );
  const getParsingStatus = useParsingStatusStore(
    (state) => state.getParsingStatus
  );
  const endParsing = () => {
    resetParserStateHistory();
    setIsCompiling(false);
  };

  const updatePrev = () => {
    prevParserState();
  };
  const prev = () => {
    console.log("parsing states", parserStateHistory);
    console.log(
      "current parsing state before",
      parserStateHistory[parserStateHistoryIterator]
    );
    updatePrev();
    console.log(
      "current parsing state after",
      parserStateHistory[parserStateHistoryIterator]
    );
  };

  return (
    <>
      <div className="controls-container">
        <div className="controls-left">
          <motion.button
            onClick={() => prev()}
            whileHover={{
              scale: 1.2,
              transition: { duration: 1 },
            }}
            whileTap={{ scale: 0.9 }}
          >
            Previous
          </motion.button>
          <motion.button
            disabled={getParsingStatus() !== "none"}
            onClick={() => nextParserState()}
            whileHover={{
              scale: 1.2,
              transition: { duration: 1 },
            }}
            whileTap={{ scale: 0.9 }}
          >
            Next
          </motion.button>
        </div>
        <div className="controls-right">
          <motion.button
            onClick={() => endParsing()}
            whileHover={{
              scale: 1.2,
              transition: { duration: 1 },
            }}
            whileTap={{ scale: 0.9 }}
            style={{ backgroundColor: "red" }}
          >
            End
          </motion.button>
        </div>
      </div>
    </>
  );
};
export default ControlPanel;
