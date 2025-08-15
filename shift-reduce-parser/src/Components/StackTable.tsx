import React from "react";
import { motion } from "motion/react";

interface StackTableProps {
  isInput: boolean; // false if for stack
  contents: string[];
}

const StackTable: React.FC<StackTableProps> = ({ isInput, contents }) => {
  return (
    <motion.div className="stack-table-container">
      <motion.table className="stack-table">
        <thead>
          <tr>
            <th>{isInput ? "User Input" : "Stack"}</th>
          </tr>
        </thead>
        <tbody>
          {contents.map((row, idx) => (
            <tr key={idx}>
              <td>{row}</td>
            </tr>
          ))}
        </tbody>
      </motion.table>
    </motion.div>
  );
};

export default StackTable;
