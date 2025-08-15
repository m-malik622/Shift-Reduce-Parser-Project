import { create } from "zustand";

interface UserInputProps {
  userInput: string[]
  setUserInput: (newUserInput: string[]) => void
}


export const useUserInputStore = create<UserInputProps>((set) => ({
    userInput: [""],
    setUserInput: (newUserInput) => set({ userInput : newUserInput }),
}))