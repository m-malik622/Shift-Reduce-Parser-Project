import React from "react";
import Toggle from "react-toggle";


interface Props {
  toggleDarkMode: () => void;
}

export const DarkModeToggle: React.FC<Props> = (toggleDarkMode) => {

  return (
    <Toggle
      onChange={() => {toggleDarkMode}}
      icons={{ checked: "🌙", unchecked: "🔆" }}
      aria-label="Dark mode toggle"
    />
  );
};