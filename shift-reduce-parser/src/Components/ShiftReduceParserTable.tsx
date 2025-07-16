import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react'
import GrammarRule from "./UI/GrammarRule";



interface ShiftReduceParserTableProps {  
  grammarRules: GrammarRule[];
}  

const ShiftReduceParserTable: React.FC<ShiftReduceParserTableProps> = ({grammarRules}) => {

  const generateTable = () => {

  }

 return (
  <>
<motion.div>
     <motion.table>

     </motion.table>
    </motion.div> 
  </>
 )
}
export default ShiftReduceParserTable;
