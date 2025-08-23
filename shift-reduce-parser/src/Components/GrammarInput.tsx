import React, { useRef, useState } from "react";
import GrammarRule from "../Utils/GrammarRule";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useGrammarRuleStore } from "../store/GrammarRulesStore";
interface GrammarInputProps {
  text: string;
}
const GrammarInput: React.FC<GrammarInputProps> = ({ text }) => {
  const addGrammarRule = useGrammarRuleStore((state) => state.addGrammarRule);

  //loacals
  const [localText, setLocalText] = useState(text);
  const [isAdded, setIsAdded] = useState(false);
  const grammarInputRef = useRef(null);

  const CheckIfValidGrammarRule = (rawGrammarStr: string) => {
    try {
      const ruleToAdd = new GrammarRule(rawGrammarStr);
      addGrammarRule(ruleToAdd);
      setIsAdded(true);
    } catch (error) {
      grammarInputRef.current;
      //change component and add animation
    }
  };

  return (
    <motion.div>
      <motion.textarea
        placeholder="E -> E + T"
        className="grammar-input"
        ref={grammarInputRef}
        disabled={isAdded}
        rows={1}
        value={localText}
        onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
          setLocalText(e.target.value)
        }
        onKeyDown={(e: {
          key: string;
          shiftKey: any;
          preventDefault: () => void;
        }) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // prevent newline
            CheckIfValidGrammarRule(localText);
          }
        }}
      />
      <motion.button
        style={isAdded ? { backgroundColor: "#3e803b" } : {}}
        onClick={() => CheckIfValidGrammarRule(localText)}
        title="Submit"
        whileHover={{
          scale: 1.2,
          transition: { duration: 1 },
        }}
        whileTap={{ scale: 0.9 }}
      >
        {isAdded ? "Added" : "Add"}
      </motion.button>
    </motion.div>
  );
};

export default GrammarInput;
