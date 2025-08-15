import { create } from "zustand";

interface IsCompilingProps {
  isCompiling: boolean
  setIsCompiling: (newIsCompiling: boolean) => void
}


export const useIsCompilingStore = create<IsCompilingProps>((set) => ({
  isCompiling: false,
  setIsCompiling: (newIsCompiling) => set({ isCompiling : newIsCompiling }),
}))