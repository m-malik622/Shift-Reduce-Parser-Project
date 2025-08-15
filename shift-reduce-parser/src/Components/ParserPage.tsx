import { useEffect, useState } from "react";
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
const ParserPage = () => {
  const isCompiling = useIsCompilingStore((state) => state.isCompiling);
  const parserStateHistory = useParserStateStore(
    (state) => state.parserStateHistory
  );
  const parserStateHistoryIterator = useParserStateStore(
    (state) => state.parserStateHistoryIterator
  );
  //local state to allow for rerender whenever a change is made to the state history(adding new state, going to previous one, reseting due to end of compilation)

  // update animations to reflect current state
  const currentParsingState = parserStateHistory[parserStateHistoryIterator];
  return (
    <>
      <div className="setup">
        <GrammarEditor />
        <InputEditor />
      </div>
      {isCompiling && (
        <div className="main display flex flex-direction column">
            <div className="control-panel">
              <ControlPanel></ControlPanel>
            </div>
          <ShiftReduceParserTable />
            <div className="stacks display flex flex-direction row gap-3">
              <StackTable
                isInput={true}
                contents={currentParsingState.get_user_input_content()}
              />
              <StackTable
                isInput={false}
                contents={currentParsingState.get_stack_content()}
              />
            <GrammarRulesDisplay></GrammarRulesDisplay>
            </div>
        </div>
      )}
    </>
  );
};

export default ParserPage;
