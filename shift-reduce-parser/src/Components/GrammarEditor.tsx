import { useState } from "react";
import GrammarRule from "./UI/GrammarRule";
import GrammarInput from "./UI/GrammarInput";

interface GrammarEditorProps {  
  updateGrammarRules: (newGrammarRules: GrammarRule[]) => void;
}  


const GrammarEditor: React.FC<GrammarEditorProps> = ({ updateGrammarRules }) => {
  //local copy of grammar rules that serves as a copy of grammar rules    
  const [LocalGrammarRules, setLocalGrammarRules] = useState<GrammarRule[]>([new GrammarRule(null)]);

  const UpdateGrammarRules = (newGrammarRules: GrammarRule[]) => {          
    //update both passed grammar rule as well as local one
    setLocalGrammarRules(newGrammarRules);
    updateGrammarRules(newGrammarRules);
  };

  const addGrammarRule = (RuleToAdd: GrammarRule | null) => {
    console.log("before adding is called:", LocalGrammarRules)
    if (RuleToAdd === null) 
      LocalGrammarRules.push(new GrammarRule(RuleToAdd));
    else
      LocalGrammarRules.push(RuleToAdd);
    UpdateGrammarRules(LocalGrammarRules);
    console.log("after adding is called:", LocalGrammarRules)

  };

  const removeGrammarRule = (index: number) => {
    console.log("passing to update grammar rules: ", LocalGrammarRules.splice(index, 1))
    UpdateGrammarRules(LocalGrammarRules.splice(index, 1));
  };
  

  return (
    <div>
      <h2>Grammar Rule Set</h2>
      <div>
        {LocalGrammarRules.map((_, index) => (
         <div key={index}>
         <GrammarInput addGrammarRule={addGrammarRule} />
         <p>index: {index}</p>
         <button className="delete-rule" onClick={() => removeGrammarRule(index)}>Remove Rule</button>
         </div>
        ))}
      </div>
      <div>
        <button className="AddGrammarRule" onClick={() => addGrammarRule(null)}>Add Rule</button>
      </div>
    </div>
  );
}
export default GrammarEditor;
