"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import CTAbutton from "@/components/layout/CTAbutton";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function OurJourney() {
  const [glowPosition, setGlowPosition] = useState<number>(0);
  const ref = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 30%"],
  });

  // Animate glow along paths
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = 0;
    const speed = 0.2;

    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;

      setGlowPosition((prev) => {
        let newPos = prev + delta * 0.001 * speed;
        return newPos >= 100 ? 0 : newPos;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Animated Scootrr component
  const AnimatedScootrr = () => {
    const text = "Scootrr";
    const fromColor = "#10171730";
    const toColor = "#101717";
    const glowColor = "#00B0B2";

    const words = text.split(" ");
    const totalChars = text.replace(/\s/g, "").length;
    let charIndex = 0;

    return (
      <span className="inline-flex whitespace-nowrap">
        {text.split("").map((char, i) => {
          const start = charIndex / totalChars;
          const end = start + 1 / totalChars;
          charIndex++;

          const color = useTransform(
            scrollYProgress,
            [start, Math.min(start + 0.2, end), end],
            [fromColor, glowColor, toColor]
          );

          const textShadow = useTransform(
            scrollYProgress,
            [
              start,
              Math.min(start + 0.1, end),
              Math.min(start + 0.3, end),
              end,
            ],
            [
              "0 0 0px rgba(0, 176, 178, 0)",
              "0 0 8px rgba(0, 176, 178, 0.8)",
              "0 0 12px rgba(0, 176, 178, 0.6)",
              "0 0 0px rgba(0, 176, 178, 0)",
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
              className="inline-block font-bold"
            >
              {char}
            </motion.span>
          );
        })}
      </span>
    );
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Bottom Left SVG */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-0 w-1/3 md:w-1/3 lg:w-1/4">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 429 379"
          preserveAspectRatio="xMinYMax meet"
          fill="none"
          className="overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="bottom-left-grey-gradient"
              x1="490.244"
              y1="-17.8706"
              x2="-114.264"
              y2="89.3237"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#D1D5DB" stopOpacity="0" />
              <stop offset="0.5" stopColor="#D1D5DB" />
              <stop offset="1" stopColor="#D1D5DB" stopOpacity="0" />
            </linearGradient>

            <linearGradient
              id="bottom-left-glow-gradient"
              x1="490.244"
              y1="-17.8706"
              x2="-114.264"
              y2="89.3237"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#00B0B2" stopOpacity="0" />
              <stop offset="30%" stopColor="#00B0B2" stopOpacity="1" />
              <stop offset="50%" stopColor="#00B0B2" />
              <stop offset="70%" stopColor="#00B0B2" stopOpacity="1" />
              <stop offset="100%" stopColor="#00B0B2" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Static grey path */}
          <path
            d="M0.290489 0.5H369.317C399.923 1.66597 459.023 39.3751 408.668 86.198L0.290489 377.699"
            stroke="url(#bottom-left-grey-gradient)"
            strokeWidth="1"
            strokeOpacity="1"
            fill="none"
          />

          {/* Animated glow path */}
          <path
            d="M0.290489 0.5H369.317C399.923 1.66597 459.023 39.3751 408.668 86.198L0.290489 377.699"
            stroke="url(#bottom-left-glow-gradient)"
            strokeWidth="2"
            strokeOpacity="1"
            strokeDasharray="15 1000"
            strokeDashoffset={`${glowPosition}`}
            fill="none"
            style={{
              filter:
                "drop-shadow(0px 0px 10px #00B0B2) drop-shadow(0px 0px 15px #00B0B2) drop-shadow(0px 0px 20px #00B0B2) drop-shadow(0px 0px 25px #00B0B2)",
              animation: "pulse 3s ease-in-out infinite",
            }}
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0; 1000"
              dur="4s"
              repeatCount="indefinite"
              calcMode="linear"
            />
          </path>
        </svg>
      </div>

      {/* left Side SVG */}
      <div className="pointer-events-none absolute top-0 left-0 z-0 h-full w-1/3 md:w-1/2 lg:w-[40%]">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 821 371"
          preserveAspectRatio="xMaxYMin meet"
          fill="none"
          className="overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="right-grey-gradient"
              x1="939.5"
              y1="-18"
              x2="-128.494"
              y2="353.017"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#D1D5DB" stopOpacity="0" />
              <stop offset="0.5" stopColor="#D1D5DB" />
              <stop offset="1" stopColor="#D1D5DB" stopOpacity="0" />
            </linearGradient>

            <linearGradient
              id="right-glow-gradient"
              x1="939.5"
              y1="-18"
              x2="-128.494"
              y2="353.017"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#00B0B2" stopOpacity="0" />
              <stop offset="30%" stopColor="#00B0B2" stopOpacity="1" />
              <stop offset="50%" stopColor="#00B0B2" />
              <stop offset="70%" stopColor="#00B0B2" stopOpacity="1" />
              <stop offset="100%" stopColor="#00B0B2" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Static grey paths */}
          <path
            d="M820.5 0V162C820.167 183 811.5 220 766.5 220L540.5 219H263.5C241.833 216.333 198.7 224.4 199.5 278V323C197.167 346.167 176.3 386.4 111.5 362L-1 318"
            stroke="url(#right-grey-gradient)"
            strokeWidth="1"
            strokeOpacity="1"
            fill="none"
          />

          {/* First animated glow path */}
          <path
            d="M820.5 0V162C820.167 183 811.5 220 766.5 220L540.5 219H263.5C241.833 216.333 198.7 224.4 199.5 278V323C197.167 346.167 176.3 386.4 111.5 362L-1 318"
            stroke="url(#right-glow-gradient)"
            strokeWidth="3"
            strokeOpacity="1"
            strokeDasharray="20 1000"
            strokeDashoffset={`${glowPosition}`}
            fill="none"
            style={{
              filter:
                "drop-shadow(0px 0px 10px #00B0B2) drop-shadow(0px 0px 15px #00B0B2) drop-shadow(0px 0px 20px #00B0B2) drop-shadow(0px 0px 25px #00B0B2)",
              animation: "pulse 3.5s ease-in-out infinite 0.5s",
            }}
          >
            <animate
              attributeName="stroke-dashoffset"
              values="1000; 0"
              dur="3s"
              repeatCount="indefinite"
              calcMode="linear"
            />
          </path>
        </svg>
      </div>

      {/* Right Side SVG */}
      <div className="pointer-events-none absolute right-0 bottom-0 z-0 w-1/3 md:w-1/2 lg:w-[40%]">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 523 427"
          preserveAspectRatio="xMinYMin meet"
          fill="none"
          className="overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="left-grey-gradient"
              x1="600.405"
              y1="447.247"
              x2="-135.826"
              y2="305.709"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.148112" stopColor="#D1D5DB" stopOpacity="0" />
              <stop offset="0.5" stopColor="#D1D5DB" />
              <stop offset="1" stopColor="#D1D5DB" stopOpacity="0" />
            </linearGradient>

            <linearGradient
              id="left-glow-gradient"
              x1="600.405"
              y1="447.247"
              x2="-135.826"
              y2="305.709"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#00B0B2" stopOpacity="0" />
              <stop offset="30%" stopColor="#00B0B2" stopOpacity="1" />
              <stop offset="50%" stopColor="#00B0B2" />
              <stop offset="70%" stopColor="#00B0B2" stopOpacity="1" />
              <stop offset="100%" stopColor="#00B0B2" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Static grey path */}
          <path
            d="M0.538941 426.5V243.998C-0.303982 216.868 12.1713 175.75 73.8733 178.278H266.566C288.987 179.963 333.426 169.38 331.808 113.568V57.958C329.279 36.0511 341.114 -5.9428 408.682 1.33704H524.5"
            stroke="url(#left-grey-gradient)"
            strokeWidth="1"
            strokeOpacity="0.5"
            fill="none"
          />

          {/* Animated glow path */}
          <path
            d="M0.538941 426.5V243.998C-0.303982 216.868 12.1713 175.75 73.8733 178.278H266.566C288.987 179.963 333.426 169.38 331.808 113.568V57.958C329.279 36.0511 341.114 -5.9428 408.682 1.33704H524.5"
            stroke="url(#left-glow-gradient)"
            strokeWidth="2"
            strokeOpacity="1"
            strokeDasharray="15 800"
            strokeDashoffset={`${glowPosition}`}
            fill="none"
            style={{
              filter:
                "drop-shadow(0px 0px 10px #00B0B2) drop-shadow(0px 0px 15px #00B0B2) drop-shadow(0px 0px 20px #00B0B2) drop-shadow(0px 0px 25px #00B0B2)",
              animation: "pulse 3s ease-in-out infinite",
            }}
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0; 800"
              dur="4s"
              repeatCount="indefinite"
              calcMode="linear"
            />
          </path>
        </svg>
      </div>

      {/* Content */}
      <section className="relative z-10 px-[20px] py-[40px] md:px-[30px] md:py-[70px] lg:px-[50px] lg:pt-[100px] lg:pb-[100px] xl:pt-[127px] xl:pb-[26px]">
        <div className="container mx-auto">
          <div className="mx-auto max-w-[993px]">
            <h3
              ref={ref}
              className="text-center text-[28px] leading-tight md:text-[35px] lg:text-[45px] xl:text-[55px]"
            >
              Our journey started with <AnimatedScootrr />, solving real world
              challenges
            </h3>
          </div>
          <div className="mt-[60px] flex flex-wrap justify-center gap-4 sm:flex-nowrap">
            <CTAbutton
              href="/contact"
              text="MDP"
              svgColor="#00B0B2"
              textColor="text-[#fff]"
              hoverTextColor="hover:text-[#000]"
              borderColor="border-[#00B0B2]"
              bgColor="bg-[#fff]"
            />
            <CTAbutton
              href="/contact"
              text="MDP"
              svgColor="#fff"
              textColor="text-[#000]"
              hoverTextColor="hover:text-[#fff]"
              borderColor="border-[#000]"
              bgColor="bg-[#000]"
            />
            <CTAbutton
              href="/contact"
              text="MDP"
              svgColor="#fff"
              textColor="text-[#000]"
              hoverTextColor="hover:text-[#fff]"
              borderColor="border-[#000]"
              bgColor="bg-[#000]"
            />
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes flow {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -400;
          }
        
      `}</style>
    </div>
  );
}

export default OurJourney;
