import type { MutableRefObject } from 'react';
import { MotionValue } from 'framer-motion';

export type Position = {
  x: number;
  y: number;
};

export const animateText = (
  sourceRef: MutableRefObject<HTMLElement | null>,
  destinationRef: MutableRefObject<HTMLElement | null>,
  text: string,
  setAnimatedText: (text: string | null) => void,
  setDestinationPosition: (position: Position) => void
) => {
  if (!sourceRef.current || !destinationRef.current) {
    console.error("Source or destination ref is not attached to an element.");
    return;
  }

  const sourceRect = sourceRef.current.getBoundingClientRect();
  const destinationRect = destinationRef.current.getBoundingClientRect();

  const finalX = destinationRect.left - sourceRect.left;
  const finalY = destinationRect.top - sourceRect.top;

  setAnimatedText(text);
  setDestinationPosition({ x: finalX, y: finalY });
};
