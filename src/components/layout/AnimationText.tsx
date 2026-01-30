"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type AnimatedTextProps = {
  text: string;
  fromColor?: string;
  toColor?: string;
  glowColor?: string;
  className?: string;
};

export default function AnimatedText({
  text,
  fromColor = "#10171730", // Light grey
  toColor = "#101717", // Dark grey/black
  glowColor = "#00B0B2", // Teal blue
  className = "",
}: AnimatedTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);

 const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start 95%", "center center"],
});
  // Split by words
  const words = text.split(" ");
  const totalChars = text.replace(/\s/g, "").length;
  let charIndex = 0;

  return (
    <h2 ref={ref} className={`leading-tight font-medium ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex whitespace-nowrap">
          {word.split("").map((char, i) => {
            const start = charIndex / totalChars;
            const end = start + 1 / totalChars;
            charIndex++;

            // Three-stage color transition: grey -> blue glow -> black
            const color = useTransform(
              scrollYProgress,
              [start, Math.min(start + 0.2, end), end], // Blue appears at 20% of character's scroll progress
              [fromColor, glowColor, toColor]
            );

            // Add glow effect when blue is active
            const textShadow = useTransform(
              scrollYProgress,
              [
                start,
                Math.min(start + 0.1, end),
                Math.min(start + 0.3, end),
                end,
              ],
              [
                "0 0 0px rgba(0, 176, 178, 0)", // No glow
                "0 0 8px rgba(0, 176, 178, 0.8)", // Strong glow
                "0 0 12px rgba(0, 176, 178, 0.6)", // Medium glow
                "0 0 0px rgba(0, 176, 178, 0)", // No glow
              ]
            );

            return (
              <motion.span
                key={i}
                style={{
                  color,
                  textShadow,
                  transition: "text-shadow 0.2s ease",
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















