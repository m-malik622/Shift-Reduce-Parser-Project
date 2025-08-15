import { AnimatePresence, motion } from 'motion/react';
import { h2 } from 'motion/react-client';
import React, { useState } from 'react'
import { useIsCompilingStore } from '../store/IsCompilingStore';
import { useUserInputStore } from '../store/UserInputStore';
import { splitTokens } from '../Utils/Tokenizer';
import { useGrammarRuleStore } from '../store/GrammarRulesStore';
import { useParserStateStore } from '../store/ParserStateStore';
import ParsingState from '../Utils/ParsingState';

const InputEditor = () => {
  const isCompiling = useIsCompilingStore((state) => state.isCompiling);
  const setIsCompiling = useIsCompilingStore((state) => state.setIsCompiling);
  const setUserInput = useUserInputStore((state) => state.setUserInput);
  const userInput = useUserInputStore((state) => state.userInput);
  const grammarRules = useGrammarRuleStore((state) => state.grammarRules);
  const initializeParserStateHistory = useParserStateStore((state) => state.initializeParserStateHistory);
  const resetParserStateHistory = useParserStateStore((state) => state.resetParserStateHistory);
  const parserStateHistory = useParserStateStore((state) => state.parserStateHistory);
  

  //locals
  const [text, setText] = useState('');
  const initializeStateHistory = (initialState: ParsingState) => {
    initializeParserStateHistory(initialState);
  }
  const startCompile = () => {
    console.log("in start compile")
    const userInputTokens = splitTokens(text, grammarRules);
    if (userInputTokens){
      setUserInput(userInputTokens);
      const initialState = new ParsingState(["0"], [...userInputTokens]);
      // do in separate function so that changes happen immediately instead of after function ends
      initializeStateHistory(initialState);
      setIsCompiling(true) 
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
