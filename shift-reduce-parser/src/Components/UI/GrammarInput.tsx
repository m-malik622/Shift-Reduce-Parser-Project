import React, { useRef, useState } from 'react'
import GrammarRule from "./GrammarRule";
import { ChevronRight } from 'lucide-react';
import { motion } from "motion/react"


interface GrammarInputProps {  
  addGrammarRule: (RuleToAdd: GrammarRule | null) => void;
}  


const GrammarInput: React.FC<GrammarInputProps> = ({ addGrammarRule }) => {
  const [text, setText] = useState('');
  const grammarInputRef = useRef(null);

  const CheckIfValidGrammarRule = (rawGrammarStr: string) => {
    try {
      const ruleToAdd = new GrammarRule(rawGrammarStr)
      addGrammarRule(ruleToAdd)
    } catch (error) {
      grammarInputRef.current
      //change omponent and add animation
    } 
  };


  return (
    <motion.div>
      <motion.textarea
        placeholder="E -> E + T" className="grammar-input"
        ref={grammarInputRef}
        rows={1}
        value={text}
        
        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setText(e.target.value)}
        onKeyDown={(e: { key: string; shiftKey: any; preventDefault: () => void; }) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // prevent newline
            CheckIfValidGrammarRule(text);
          }
        }}
        />
        <motion.button
          onClick={() => CheckIfValidGrammarRule(text)}
          title="Submit"
          whileHover={{
            scale: 1.2,
            transition: { duration: 1 },
          }}
          whileTap={{ scale: 0.9 }}
        >
          Add
        </motion.button>
    </motion.div>
  )
}

export default GrammarInput