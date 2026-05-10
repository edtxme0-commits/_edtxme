import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

const AnimatedText = ({ text, className = '' }: AnimatedTextProps) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2']
  });

  const words = text.split(' ');

  return (
    <p ref={containerRef} className={className} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        return (
          <Word key={i} word={word} progress={scrollYProgress} range={[start, end]} />
        );
      })}
    </p>
  );
};

const Word = ({ word, progress, range }: { word: string, progress: any, range: number[] }) => {
  const characters = word.split('');
  const amount = range[1] - range[0];
  const step = amount / word.length;
  
  return (
    <span className="relative mr-2 mt-1">
      {characters.map((char, i) => {
        const start = range[0] + (i * step);
        const end = range[0] + ((i + 1) * step);
        return (
          <Character key={i} char={char} progress={progress} range={[start, end]} />
        );
      })}
    </span>
  );
};

const Character = ({ char, progress, range }: { char: string, progress: any, range: number[] }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative">
      <span className="absolute opacity-20">{char}</span>
      <motion.span style={{ opacity }}>{char}</motion.span>
    </span>
  );
};

export default AnimatedText;
