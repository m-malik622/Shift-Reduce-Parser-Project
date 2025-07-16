import { useState } from 'react'
import './App.css'
import GrammarEditor from './Components/GrammarEditor';
import InputEditor from './Components/InputEditor';
import GrammarRule from "./Components/UI/GrammarRule";
import ShiftReduceParserTable from './Components/ShiftReduceParserTable';


function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [GrammarRules, setGrammarRules] = useState<GrammarRule[]>([new GrammarRule(null)]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [userInput, setUserInput] = useState("");

    const updateGrammarRules = (newGrammarRules: GrammarRule[]) => {
      setGrammarRules(newGrammarRules);
    };

    return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <div className='hero-section'>
        <p>TODO: add hero section with cool animation/video shocasing what reduce shift parser does</p>
      </div>
      <div className="parser-page">
        <div className="setup">
          <GrammarEditor updateGrammarRules={updateGrammarRules}/>
          <InputEditor updateIsCompiling={setIsCompiling} updateUserInput={setUserInput}/>
        </div>
        <div className="main">
          <ShiftReduceParserTable grammarRules={GrammarRules} />
        </div>
      </div>
    </div>
  );
}

export default App
