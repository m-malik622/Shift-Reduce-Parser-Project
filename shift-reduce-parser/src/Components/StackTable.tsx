import React from "react";
import { AnimatePresence, motion, scale } from "motion/react";
import { Scale } from "lucide-react";

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
            <motion.tr key={idx}
            initial={{ opacity: 0, height: 0, scale:0 }}
            animate={{ opacity: 1, height: 'auto', scale:1 }}
            exit={{ opacity: 0, height: 0, Scale:0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.25 }}
            >
              <td>{row}</td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </motion.div>
  );
};

export default StackTable;
