import { useState } from "react";
import "./App.css";
import GrammarEditor from "./Components/GrammarEditor";
import InputEditor from "./Components/InputEditor";
import GrammarRule from "./Utils/GrammarRule";
import ShiftReduceParserTable from "./Components/ShiftReduceParserTable";
import ParserPage from "./Components/ParserPage";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <div className="hero-section">
        <p>
          TODO: add hero section with cool animation/video showcasing what
          reduce shift parser does
        </p>
      </div>
      <div className="parser-page">
        <ParserPage />
      </div>
    </div>
  );
}

export default App;
