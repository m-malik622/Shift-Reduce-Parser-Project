import { create } from "zustand";
import ParsingState from "../Utils/ParsingState";
import { GenerateNextParsingState } from "../Utils/GenerateNextParsingState";
import { useGrammarRuleStore } from "./GrammarRulesStore";
import { useParsingTableStore } from "./ParsingTableStore";
import { useParsingStatusStore } from "./ParsingStatusStore";

interface ParserStateStoreProps {
  parserStateHistory: ParsingState[];
  parserStateHistoryIterator: number;
  initializeParserStateHistory: (firstParsingState: ParsingState) => void;
  prevParserState: () => void;
  nextParserState: () => void;
  resetParserStateHistory: () => void;
}

export const useParserStateStore = create<ParserStateStoreProps>((set) => ({
  parserStateHistory: [new ParsingState()],
  parserStateHistoryIterator: 0,

  initializeParserStateHistory: (firstParsingState: ParsingState) => {
    const newUserInput = [...firstParsingState.userInputContent, "$"].reverse();
    const clonedState = new ParsingState([...firstParsingState.stackContent], newUserInput);
    useParsingStatusStore.getState().setParsingStatus("none");
    set(() => ({
      parserStateHistory: [clonedState],
      parserStateHistoryIterator: 0,
    }));
  },

prevParserState: () => {
  useParsingStatusStore.getState().setParsingStatus("none");
  set((state) => ({
    parserStateHistoryIterator: Math.max(0, state.parserStateHistoryIterator - 1),
  }))
}
,

nextParserState: () => set((state) => {
    if (state.parserStateHistoryIterator < state.parserStateHistory.length - 1) {
      // If there's a next state in history, move to it
      return { parserStateHistoryIterator: state.parserStateHistoryIterator + 1 };
    } 
    else {
      // If at the end of history (or history is empty), generate and add a new state
      const parserTable = useParsingTableStore.getState().parser_table_as_dictionary;
      const grammarRules = useGrammarRuleStore.getState().grammarRules;
      const lastState = state.parserStateHistory[state.parserStateHistoryIterator];
            
      try {
          const nextState: ParsingState = GenerateNextParsingState(new ParsingState([...lastState.stackContent], [...lastState.userInputContent]),
          parserTable,
          grammarRules
        );
        const newHistory: ParsingState[] = [...state.parserStateHistory, nextState];
        return {
          parserStateHistory: newHistory,
          parserStateHistoryIterator: newHistory.length - 1,
        };
    } 
    catch (err: unknown) {
      if (typeof err === "object" && err !== null && "flag" in err && "content" in err) {
        if (err.flag === "complete") {
          const nextState: ParsingState = err.content as ParsingState;
          const newHistory: ParsingState[] = [...state.parserStateHistory, nextState];
          useParsingStatusStore.getState().setParsingStatus("complete");
          return {
            parserStateHistory: newHistory,
            parserStateHistoryIterator: newHistory.length - 1,
          };
        } 
        else if (err.flag === "error") {
          console.log(err.content);
          useParsingStatusStore.getState().setParsingStatus("error");
        } 
      } 
      else {
        console.error("Unexpected exception during parsing:", err);
      }
    }
    return {
        parserStateHistory: state.parserStateHistory,
        parserStateHistoryIterator: state.parserStateHistoryIterator,
    };
    }
}),
  resetParserStateHistory: () => {
    useParsingStatusStore.getState().setParsingStatus("none");
    set({
      parserStateHistory: [new ParsingState()],
      parserStateHistoryIterator: 0,
    });
  },
}));



