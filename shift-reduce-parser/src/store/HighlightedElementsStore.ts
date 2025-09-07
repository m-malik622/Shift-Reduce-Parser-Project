import { create } from "zustand";
import type { RefObject } from "react";

interface HighlightedElementsProps {
  highlightedRefs: RefObject<HTMLElement>[];
  rehighlightElements: (newRefs: RefObject<HTMLElement>[]) => void;
  resetRefs: () => void;
}

export const useHighlightedElementsStore = create<HighlightedElementsProps>((set, get) => ({
    highlightedRefs: [],
    rehighlightElements: (newRefs) => {
      const prevRefs = get().highlightedRefs;

      prevRefs.forEach((ref) => {
        if (ref.current) {
          ref.current.classList.remove("highlight");
        }
      });

      newRefs.forEach((ref) => {
        if (ref.current) {
          ref.current.classList.add("highlight");
        }
      });

      set({ highlightedRefs: newRefs });
    },

    resetRefs: () => {
      const prevRefs = get().highlightedRefs;

      prevRefs.forEach((ref) => {
        if (ref.current) {
          ref.current.classList.remove("highlight");
        }
      });

      set({ highlightedRefs: [] });
    },

}));
