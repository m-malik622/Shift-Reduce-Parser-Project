import { useState } from "react";
import "./App.css";
import GrammarEditor from "./Components/GrammarEditor";
import InputEditor from "./Components/InputEditor";
import GrammarRule from "./Utils/GrammarRule";
import ShiftReduceParserTable from "./Components/ShiftReduceParserTable";
import ParserPage from "./Components/ParserPage";
import Hero from "./Components/Hero";
function App() {
  const [darkMode, setDarkMode] = useState(true);
  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <div className="hero-section">
      <Hero></Hero>
      </div>
      <div className="parser-page">
        <ParserPage />
      </div>
    </div>
  );
}

export default App;
