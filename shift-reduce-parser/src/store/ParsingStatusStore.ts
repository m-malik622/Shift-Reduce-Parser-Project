import { create } from "zustand";

type ParsingStatus = "none" | "complete" | "error";

interface ParsingStatusStoreProps {
  parsingStatus: ParsingStatus;
  setParsingStatus: (newStatus: ParsingStatus) => void;
  getParsingStatus: () => ParsingStatus;
}

export const useParsingStatusStore = create<ParsingStatusStoreProps>((set, get) => ({
  parsingStatus: "none",
  setParsingStatus: (newStatus) => set({ parsingStatus: newStatus }),
  getParsingStatus: () => get().parsingStatus,
}));
