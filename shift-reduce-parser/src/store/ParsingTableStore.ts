import { create } from "zustand";

interface ParsingTableProps {
    header: string[],
    setHeader: (newHeader: string[]) => void,
    rows: string[][],
    setRows: (newRows: string[][]) => void,
    parser_table_as_dictionary: { [key: string]: { [key: string]: string } },
    create_parser_table_dictionary: () => void
}


export const useParsingTableStore = create<ParsingTableProps>((set) => ({
    header: [""],
    setHeader: (newHeader) => set({ header : newHeader }),
    rows: [[""]],
    setRows: (newRows) => set({ rows : newRows }),
    parser_table_as_dictionary: {},
    create_parser_table_dictionary: () => {set((state) => {
        const tableDict: { [key: string]: { [key: string]: string } } = {};

        state.rows.forEach((row) => {
        const currState = row[0]; // use first column as key
        const rowDict: { [key: string]: string } = {};
        for (let i = 1; i < state.header.length; i++) {
            const symbol = state.header[i];
            const value = row[i] !== undefined ? row[i].trim() : "";
            rowDict[symbol] = value;
        }

        tableDict[currState] = rowDict;
        });
      return { parser_table_as_dictionary : tableDict};
    });
    }
}))