import { useState } from "react";
import "./App.css";
import ParserPage from "./Components/ParserPage";
import Hero from "./Components/Hero";
import ErrorPopup from "./Components/ErrorPopup";
function App() {
  const toggleMode = () => {
    setDarkMode(!darkMode);
  };
  const [darkMode, setDarkMode] = useState(true);
  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <div className="body">
          <button onClick={toggleMode} className="toggle-btn">
            Toggle Mode
          </button>
        <div className="hero-section">
          <Hero />
        </div>
        <div className="parser-page">
          <ParserPage />
        </div>
      </div>
      <ErrorPopup />
    </div>
  );
}

export default App;
