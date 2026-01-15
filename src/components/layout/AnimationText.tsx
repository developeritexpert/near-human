'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

type AnimatedTextProps = {
  text: string;
  fromColor?: string;
  toColor?: string;
  className?: string;
};

export default function AnimatedText({
  text,
  fromColor = '#10171730',
  toColor = '#101717',
  className = '',
}: AnimatedTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 30%'],
  });

  // 🔹 split by words, NOT characters
  const words = text.split(' ');
  const totalChars = text.replace(/\s/g, '').length;
  let charIndex = 0;

  return (
    <h2
      ref={ref}
      className={`font-medium leading-tight ${className}`}
    >
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          className="inline-flex whitespace-nowrap"
        >
          {word.split('').map((char, i) => {
            const start = charIndex / totalChars;
            const end = start + 1 / totalChars;
            charIndex++;

            const color = useTransform(
              scrollYProgress,
              [start, end],
              [fromColor, toColor]
            );

            return (
              <motion.span
                key={i}
                style={{ color }}
                className="inline-block"
              >
                {char}
              </motion.span>
            );
          })}

          {/* space after word */}
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </h2>
  );
}