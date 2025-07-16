import { AnimatePresence, motion } from 'motion/react';
import { h2 } from 'motion/react-client';
import React, { useState } from 'react'



interface InputEditorProps {  
  updateIsCompiling: (state: boolean) => void;
  updateUserInput: (state: string) => void;
}  

const InputEditor: React.FC<InputEditorProps> = ({ updateIsCompiling, updateUserInput }) => {
  const [text, setText] = useState('');
  const [localIsCompiling, setLocalIsCompiling] = useState(false) //flag for button display

  const startCompile = () => {
    setLocalIsCompiling(true)
    updateIsCompiling(true) // pass to parent
    updateUserInput(text) //pass to parent
  }

  const stopCompile = () => {
    setLocalIsCompiling(false)
    updateIsCompiling(false) // pass to parent
    updateUserInput(text) //pass to parent
  }
 return (
  <>
  <h2>Enter Your Input</h2>
<motion.div>
      <motion.textarea
        placeholder="id + ( id * id )" className="grammar-input"
        rows={1}
        value={text}
        disabled={localIsCompiling}
        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setText(e.target.value)}
        onKeyDown={(e: { key: string; shiftKey: any; preventDefault: () => void; }) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // prevent newline
            updateIsCompiling(true);
          }
        }}
        />
        <motion.button
          onClick={() => {
            if (localIsCompiling) {
              stopCompile(); 
            } else {
              startCompile();
            }
          }}
          title={localIsCompiling ? "Stop" : "Submit"}
          whileHover={{
            scale: 1.2,
            transition: { duration: 1 },
          }}
          whileTap={{ scale: 0.9 }}
          >
            {` ${
            localIsCompiling ? "Stop" : "Compile"}`}
      </motion.button>
    </motion.div> 
  </>
 )
}
export default InputEditor;
