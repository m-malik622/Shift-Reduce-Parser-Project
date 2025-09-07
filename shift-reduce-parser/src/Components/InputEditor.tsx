import {  motion } from 'motion/react';
import React, { useState } from 'react'
import { useIsCompilingStore } from '../store/IsCompilingStore';
import { useUserInputStore } from '../store/UserInputStore';
import { splitTokens } from '../Utils/Tokenizer';
import { useGrammarRuleStore } from '../store/GrammarRulesStore';
import { useParserStateStore } from '../store/ParserStateStore';
import ParsingState from '../Utils/ParsingState';
import { useErrorStore } from '../store/ErrorStore';
const InputEditor = () => {
  const isCompiling = useIsCompilingStore((state) => state.isCompiling);
  const setIsCompiling = useIsCompilingStore((state) => state.setIsCompiling);
  const setUserInput = useUserInputStore((state) => state.setUserInput);
  const grammarRules = useGrammarRuleStore((state) => state.grammarRules);
  const initializeParserStateHistory = useParserStateStore((state) => state.initializeParserStateHistory);
  const resetParserStateHistory = useParserStateStore((state) => state.resetParserStateHistory);
  const showError = useErrorStore((state) => state.showError);


  //locals
  const [text, setText] = useState('');
  const initializeStateHistory = (initialState: ParsingState) => {
    initializeParserStateHistory(initialState);
  }
  const startCompile = () => {
    try{
      const userInputTokens = splitTokens(text, grammarRules);
      setUserInput(userInputTokens);
      const initialState = new ParsingState(["0"], [...userInputTokens]);
      // do in separate function so that changes happen immediately instead of after function ends
      initializeStateHistory(initialState);
      setIsCompiling(true) 
  }
    catch(error){
      showError("Unable to Compile. Please make sure there are spaces between symbols and symbols are consistent(all represented as id for example)", "error");
    }
  }

  const stopCompile = () => {
    resetParserStateHistory()
    setIsCompiling(false)
  }
 return (
  <>
  <h2>Enter Your Input</h2>
<motion.div>
      <motion.textarea
        placeholder="id + ( id * id )" className="grammar-input"
        rows={1}
        value={text}
        disabled={isCompiling}
        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setText(e.target.value)}
        onKeyDown={(e: { key: string; shiftKey: any; preventDefault: () => void; }) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // prevent newline
              startCompile();
          }
        }}
        />
        <motion.button
          onClick={() => {
            if (isCompiling) {
              stopCompile(); 
            } else {
              startCompile();
            }
          }}
          title={isCompiling ? "Stop" : "Submit"}
          whileHover={{
            scale: 1.2,
            transition: { duration: 1 },
          }}
          whileTap={{ scale: 0.9 }}
          >
            {` ${
            isCompiling ? "Stop" : "Compile"}`}
      </motion.button>
    </motion.div> 
  </>
 )
}
export default InputEditor;
