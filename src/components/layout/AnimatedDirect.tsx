"use client";

import { motion } from "framer-motion";

type AnimatedDirectProps = {
  text: string;
  fromColor?: string;
  toColor?: string;
  glowColor?: string;
  className?: string;
};

export default function AnimatedDirect({
  text,
  fromColor = "#10171730",
  toColor = "#101717",
  glowColor = "#00B0B2",
  className = "",
}: AnimatedDirectProps) {
  const words = text.split(" ");
  const totalChars = text.replace(/\s/g, "").length;
  let charIndex = 0;

  return (
    <h2 className={`leading-tight font-medium ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex whitespace-nowrap">
          {word.split("").map((char, i) => {
            const delay = charIndex * 0.08; // animation speed
            charIndex++;

            return (
              <motion.span
                key={i}
                initial={{
                  color: fromColor,
                  textShadow: "0 0 0px rgba(0,0,0,0)",
                }}
                animate={{
                  color: [fromColor, glowColor, toColor],
                  textShadow: [
                    "0 0 0px rgba(0,0,0,0)",
                    "0 0 10px rgba(0,176,178,0.9)",
                    "0 0 0px rgba(0,0,0,0)",
                  ],
                }}
                transition={{
                  delay,
                  duration: 0.8,
                  ease: "easeInOut",
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            );
          })}

          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </h2>
  );
}