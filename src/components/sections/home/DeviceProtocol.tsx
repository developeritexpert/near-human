import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const TITLE_TEXT = "Model to Device Protocol";

const DeviceProtocol: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const svgBgRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  /* ───────── WAIT FOR LAYOUT ───────── */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
      ScrollTrigger.refresh();
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  /* ───────── SVG BOX ANIMATION ───────── */
  useEffect(() => {
    if (!svgBgRef.current) return;

    const boxes = svgBgRef.current.querySelectorAll(".svg-box");

    const animateBoxes = () => {
      boxes.forEach((box) => {
        const randomDelay = Math.random() * 2000;
        const randomDuration = 1000 + Math.random() * 1000;

        setTimeout(() => {
          gsap.to(box, {
            opacity: 0.3,
            duration: randomDuration / 1000,
            ease: "power2.inOut",
            yoyo: true,
            repeat: 1,
          });
        }, randomDelay);
      });
    };

    const interval = setInterval(animateBoxes, 1500);
    animateBoxes(); // Start immediately

    return () => clearInterval(interval);
  }, []);

  /* ───────── GLOWING LINE ANIMATION ───────── */
  useEffect(() => {
    if (!svgBgRef.current) return;

    const svg = svgBgRef.current.querySelector("svg");
    const container = svgBgRef.current.querySelector(".animated-boxes");
    if (!svg || !container) return;

    const svgRect = svg.getBoundingClientRect();
    const gridSize = 80;
    const cols = Math.ceil(svgRect.width / gridSize);
    const rows = Math.ceil(svgRect.height / gridSize);

    // Create grid boxes
    const boxes: SVGRectElement[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        rect.setAttribute("x", (col * gridSize).toString());
        rect.setAttribute("y", (row * gridSize).toString());
        rect.setAttribute("width", gridSize.toString());
        rect.setAttribute("height", gridSize.toString());
        rect.setAttribute("fill", "none");
        rect.setAttribute("stroke", "#00B0B2");
        rect.setAttribute("stroke-width", "2");
        rect.setAttribute("opacity", "0");
        rect.setAttribute("filter", "url(#boxGlow)");
        rect.classList.add("svg-box");
        container.appendChild(rect);
        boxes.push(rect);
      }
    }

    // Animation patterns
    const animatePattern = () => {
      const pattern = Math.floor(Math.random() * 4);

      if (pattern === 0) {
        // Wave effect from left to right
        boxes.forEach((box, index) => {
          const col = index % cols;
          gsap.to(box, {
            opacity: 0.6,
            duration: 0.5,
            delay: col * 0.05,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(box, { opacity: 0, duration: 0.5, delay: 0.2 });
            },
          });
        });
      } else if (pattern === 1) {
        // Random box flash
        const numFlashes = 8 + Math.floor(Math.random() * 12);
        for (let i = 0; i < numFlashes; i++) {
          const randomBox = boxes[Math.floor(Math.random() * boxes.length)];
          gsap.to(randomBox, {
            opacity: 0.7,
            duration: 0.5,
            delay: i * 0.1,
            ease: "power2.inOut",
            yoyo: true,
            repeat: 1,
          });
        }
      } else if (pattern === 2) {
        // Scanning line (horizontal)
        const scanRow = Math.floor(Math.random() * rows);
        boxes.forEach((box, index) => {
          const row = Math.floor(index / cols);
          if (row === scanRow) {
            const col = index % cols;
            gsap.to(box, {
              opacity: 0.8,
              duration: 0.15,
              delay: col * 0.03,
              ease: "none",
              onComplete: () => {
                gsap.to(box, { opacity: 0, duration: 0.3 });
              },
            });
          }
        });
      } else {
        // Radial pulse from center
        const centerCol = Math.floor(cols / 2);
        const centerRow = Math.floor(rows / 2);
        boxes.forEach((box, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          const distance = Math.sqrt(
            Math.pow(col - centerCol, 2) + Math.pow(row - centerRow, 2)
          );
          gsap.to(box, {
            opacity: 0.5,
            duration: 0.5,
            delay: distance * 0.05,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(box, { opacity: 0, duration: 0.4, delay: 0.1 });
            },
          });
        });
      }
    };

    // Run animations periodically
    const interval = setInterval(animatePattern, 3000);
    animatePattern(); // Start immediately

    return () => {
      clearInterval(interval);
      boxes.forEach((box) => box.remove());
    };
  }, []);

  useGSAP(
    () => {
      if (!sectionRef.current || !isReady) return;

      const ctx = gsap.context(() => {
        const words = gsap.utils.toArray<HTMLElement>(".dp-word");
        const firstLetters =
          gsap.utils.toArray<HTMLElement>(".dp-first-letter");

        /* ───────── INITIAL STATE ───────── */
        gsap.set(".dp-letter", { opacity: 1 });
        gsap.set(words, { x: 0 });

        /* ───────── TIMELINE ───────── */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=300%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: -1,
            id: "device-protocol",
          },
        });

        /* ───────── STEP 1: FADE OUT ALL NON-FIRST LETTERS ───────── */
        tl.to(".dp-letter:not(.dp-first-letter)", {
          opacity: 0,
          stagger: 0.02,
          ease: "none",
          duration: 0.7,
        });

        /* ───────── STEP 2: CENTER FIRST LETTERS HORIZONTALLY ───────── */
        tl.to(firstLetters, {
          x: (index) => {
            const containerRect = sectionRef.current!.getBoundingClientRect();
            const containerCenter =
              containerRect.left + containerRect.width / 2;

            // Spacing between letters
            const letterSpacing = 12;

            // Get widths of all first letters
            const letterWidths = firstLetters.map(
              (letter) => letter.getBoundingClientRect().width
            );

            // Calculate total width including spacing
            const totalLetterWidth = letterWidths.reduce(
              (sum, width) => sum + width,
              0
            );
            const totalSpacing = (firstLetters.length - 1) * letterSpacing;
            const totalWidth = totalLetterWidth + totalSpacing;

            // Starting position (left edge of the group)
            const startX = containerCenter - totalWidth / 2;

            // Calculate target position for this letter
            let targetX = startX;
            for (let i = 0; i < index; i++) {
              targetX += letterWidths[i] + letterSpacing;
            }

            // Get current position of this letter (left edge)
            const currentRect = firstLetters[index].getBoundingClientRect();
            const currentLeft = currentRect.left;

            // Return the offset needed
            return targetX - currentLeft;
          },
          ease: "power2.inOut",
          duration: 0.7,
        });

        /* ───────── STEP 3: BACKGROUND TRANSITION (AFTER COMBINING) ───────── */
        tl.to(
          bgImageRef.current,
          {
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
          },
          "+=0.1" // Wait a bit after letters combine
        ).to(
          svgBgRef.current,
          {
            opacity: 1,
            duration: 0.6,
            ease: "power2.inOut",
          },
          "<" // Start at the same time as image fade
        );

        /* ───────── STEP 4: HOLD FOR ADDITIONAL SCROLLS ───────── */
        tl.to({}, { duration: 2 }); // Empty tween to add scroll distance
      }, sectionRef);

      return () => ctx.revert();
    },
    { dependencies: [isReady], scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen bg-black px-[20px] md:px-[30px] lg:px-[50px]"
      style={{
        visibility: isReady ? "visible" : "hidden",
        opacity: isReady ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      {/* Background Image */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 z-0 -mt-[50px] h-[calc(100%_+_50px)] w-full"
      >
        <img
          src="/img/device-proto-img1.png"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      {/* SVG Box Background */}
      <div
        ref={svgBgRef}
        className="absolute inset-0 z-0 h-full w-full bg-black"
        style={{ opacity: 0 }}
      >
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <rect
                width="80"
                height="80"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            </pattern>
            <filter id="boxGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <g className="animated-boxes"></g>
        </svg>
      </div>

      {/* Center BG */}
      <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <img src="/img/device-proto-bg.png" alt="" />
      </div>

      {/* Content */}
      <div className="container mx-auto flex h-full items-center justify-center">
        <div className="relative z-20 text-center">
          <h3 className="mb-[19px] text-[25px] text-white md:text-[32px] lg:text-[38px] xl:text-[45px]">
            That's the
          </h3>

          {/* WORD → LETTER SPLIT */}
          <h2 className="flex flex-wrap justify-center text-[32px] font-medium text-white sm:text-[38px] md:text-[50px] lg:text-[80px] xl:text-[110px]">
            {TITLE_TEXT.split(" ").map((word, wordIndex) => {
              const isVisibleWord = word.toLowerCase() !== "to";

              return (
                <span
                  key={wordIndex}
                  className={`mr-[14px] inline-flex ${
                    isVisibleWord ? "dp-word" : ""
                  }`}
                >
                  {word.split("").map((char, charIndex) => (
                    <span
                      key={charIndex}
                      className={`dp-letter inline-block ${
                        charIndex === 0 && isVisibleWord
                          ? "dp-first-letter"
                          : ""
                      }`}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              );
            })}
          </h2>
        </div>
      </div>
    </section>
  );
};

export default DeviceProtocol;
