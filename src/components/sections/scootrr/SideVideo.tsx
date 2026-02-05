"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedText from "@/components/layout/AnimationText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const THEME = {
  primary: "#00B0B2",
  dark: "#101717",
  muted: "#1017171F",
  mutedText: "#10171740",
};

function SideVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const textItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const videoItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const svgPathRef = useRef<SVGPathElement>(null);
  const [isReady, setIsReady] = useState(false);

  const statisticsData = [
    {
      id: "01",
      number: "30,000+",
      description: "injuries in the UK and EU alone",
      video: "/Videos/scootr/scottr.mp4",
    },
    {
      id: "02",
      number: "1,300",
      description:
        "reported casualties in the UK alone, costing the NHS and Insurers ~£7M",
      video: "/Videos/scootr/scootr_2.mp4",
    },
    {
      id: "03",
      number: "9,425",
      description:
        "Germany reported 9,425 E-Scooter accidents, marking a 14.1% increase from the previous year.",
      video: "/Videos/scootr/scooter-last.mp4",
    },
  ];

  const generateNotchPath = (progress: number, isMobile: boolean = false) => {
    const cornerRadius = 20;
    const offset = 2; // Offset to cover video edges

    if (isMobile) {
      // Mobile: notch at bottom, moves horizontally
      const minX = 100;
      const totalTravel = 600;
      const notchX = minX + (progress / 2) * totalTravel;
      const notchWidth = 220;
      const notchDepth = 30;

      return `
        M 0 0
        H 900
        V 700
        H 0
        Z
        M ${cornerRadius + offset} ${cornerRadius + offset}
        Q ${offset} ${cornerRadius + offset} ${offset} ${cornerRadius * 2 + offset}
        V ${700 - notchDepth - cornerRadius - offset}
        Q ${offset} ${700 - notchDepth - offset} ${cornerRadius + offset} ${700 - notchDepth - offset}
        H ${notchX}
        L ${notchX + 40} ${700 - notchDepth - 20 - offset}
        H ${notchX + notchWidth - 40}
        L ${notchX + notchWidth} ${700 - notchDepth - offset}
        H ${900 - cornerRadius - offset}
        Q ${900 - offset} ${700 - notchDepth - offset} ${900 - offset} ${700 - notchDepth - cornerRadius - offset}
        V ${cornerRadius * 2 + offset}
        Q ${900 - offset} ${cornerRadius + offset} ${900 - cornerRadius - offset} ${cornerRadius + offset}
        Z
      `;
    } else {
      // Desktop: notch at left, moves vertically
      const minY = 100;
      const totalTravel = 250;
      const notchY = minY + (progress / 2) * totalTravel;
      const notchHeight = 220;
      const notchDepth = 30;

      return `
        M 0 0
        H 900
        V 700
        H 0
        Z
        M ${notchDepth + offset} ${notchY}
        L ${notchDepth + 20 + offset} ${notchY + 40}
        V ${notchY + notchHeight - 40}
        L ${notchDepth + offset} ${notchY + notchHeight}
        V ${700 - cornerRadius - offset}
        Q ${notchDepth + offset} ${700 - offset} ${notchDepth + cornerRadius + offset} ${700 - offset}
        H ${900 - cornerRadius - offset}
        Q ${900 - offset} ${700 - offset} ${900 - offset} ${700 - cornerRadius - offset}
        V ${cornerRadius + offset}
        Q ${900 - offset} ${offset} ${900 - cornerRadius - offset} ${offset}
        H ${notchDepth + cornerRadius + offset}
        Q ${notchDepth + offset} ${offset} ${notchDepth + offset} ${cornerRadius + offset}
        Z
      `;
    }
  };

  useEffect(() => {
    // Component mounted, ready to animate
  }, []);

  // Mark component as ready after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady || !pinRef.current) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: "(max-width: 767px)",
        isDesktop: "(min-width: 768px)",
      },
      (context) => {
        const { isMobile, isDesktop } = context.conditions as {
          isMobile: boolean;
          isDesktop: boolean;
        };

        const texts = textItemsRef.current;
        const videos = videoItemsRef.current;

        const itemSize = isMobile ? window.innerWidth : 600;

        /* =========================
         INITIAL SETUP
      ========================== */

        gsap.set(texts, {
          position: "absolute",
          x: isMobile ? (i) => i * itemSize : 0,
          y: isDesktop ? (i) => i * itemSize : 0,
          opacity: 1,
        });

        gsap.set(videos, { zIndex: (i) => i + 1, opacity: 0 });
        gsap.set(videos[0], { opacity: 1 });

        if (svgPathRef.current) {
          gsap.set(svgPathRef.current, {
            attr: { d: generateNotchPath(0, isMobile) },
          });
        }

        const totalSections = statisticsData.length;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top top",
            end: `+=${totalSections * 900}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        /* =========================
         LOOP THROUGH SECTIONS
      ========================== */
        statisticsData.forEach((_, index) => {
          if (index === 0) return;

          const positionValue = `-=${itemSize}`;

          timeline
            .to(
              texts,
              {
                x: isMobile ? positionValue : 0,
                y: isDesktop ? positionValue : 0,
                duration: 1,
                ease: "none",
              },
              index
            )
            .to(videos[index], { opacity: 1, duration: 0.5 }, index + 0.25)
            .to(
              svgPathRef.current,
              {
                attr: { d: generateNotchPath(index, isMobile) },
                duration: 1,
                ease: "none",
              },
              index
            );
        });

        return () => {
          ScrollTrigger.getAll().forEach((t) => t.kill());
        };
      }
    );

    return () => mm.revert();
  }, [isReady]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 overflow-hidden bg-white py-[50px]"
    >
      <div
        ref={pinRef}
        className="flex !h-screen flex-col justify-center bg-white px-[20px] md:px-[30px] lg:px-[50px]"
      >
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center lg:flex-row">
          {/* LEFT: Statistics - Vertical Scroll */}
          <div className="relative order-2 mt-10 flex h-full w-full items-center lg:order-1 lg:mt-0 lg:w-1/2">
            <div className="flex w-full flex-row lg:pl-[50px] xl:pl-[100px] 2xl:pl-[200px]">
              <div ref={textContainerRef} className="relative w-full">
                {statisticsData.map((item, index) => (
                  <div
                    key={item.id}
                    ref={(el) => {
                      textItemsRef.current[index] = el;
                    }}
                    className="absolute top-0 left-0 w-full lg:max-w-[450px]"
                  >
                    <h2 className="mb-[8px] text-[36px] leading-tight font-[450] text-[#101717] md:text-[50px] lg:text-[60px] xl:text-[77px]">
                      <AnimatedText
                        text={item.number}
                        className="text-[36px] font-[450] md:text-[50px] lg:text-[60px] xl:text-[77px]"
                      />
                    </h2>
                    <p className="text-[18px] leading-relaxed font-normal text-[#101717] md:text-[22px] xl:text-[25px]">
                      <AnimatedText
                        text={item.description}
                        className="text-[18px] font-normal md:text-[22px] xl:text-[25px]"
                      />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Video */}
          <div className="relative order-1 flex w-full items-center justify-center after:absolute after:top-1/2 after:right-full after:z-[999] after:h-full after:w-full after:bg-[repeating-linear-gradient(360deg,white,transparent)] after:content-[''] lg:order-2 lg:w-1/2">
            <div className="relative aspect-[900/700] w-full overflow-hidden rounded-xl lg:w-[90%] xl:w-full">
              {/* VIDEOS STACK */}
              {statisticsData.map((item, index) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    videoItemsRef.current[index] = el;
                  }}
                  className="absolute inset-0 h-full w-full"
                >
                  <video
                    className="pointer-events-none h-full w-full object-cover"
                    src={item.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                  />
                </div>
              ))}

              {/* AVG OVERLAY (Combined) */}

              <svg
                className="pointer-events-none absolute inset-0 z-20 h-full w-full scale-[1.01]"
                viewBox="0 0 900 700"
                preserveAspectRatio="none"
              >
                <path
                  ref={svgPathRef}
                  d={generateNotchPath(0)}
                  fill="#ffffff"
                />
              </svg>

              {/* GLOW */}
              <div
                className="pointer-events-none absolute z-0 rounded-full blur-3xl"
                style={{
                  width: "200px",
                  height: "200px",
                  background: THEME.primary,
                  opacity: 0.15,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="h-12" />
    </section>
  );
}

export default SideVideo;
