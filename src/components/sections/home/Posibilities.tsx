"use client";

import AnimatedText from "@/components/layout/AnimationText";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugin once at module level
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Theme colors
const THEME = {
  primary: "#00B0B2",
  dark: "#101717",
  muted: "#10171740", // 25% opacity dark
  mutedLight: "#10171725",
};

function Possibilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const textItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const notchRef = useRef<HTMLDivElement>(null);
  const svgPathRef = useRef<SVGPathElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Device categories with corresponding video paths
  const deviceCategories = [
    {
      id: "01",
      title: "Accessibility and assistive devices",
      video: "/Videos/possibilities/possibilities_1.mp4",
    },
    {
      id: "02",
      title: "Personal consumer devices",
      video: "/Videos/possibilities/possibilities_2.mp4",
    },
    {
      id: "03",
      title: "Smart home ecosystems",
      video: "/Videos/possibilities/possibilities_3.mp4",
    },
    {
      id: "04",
      title: "Vehicles and mobility",
      video: "/Videos/possibilities/possibilities_4.mp4",
    },
    {
      id: "05",
      title: "Wearables and ambient companions",
      video: "/Videos/possibilities/possibilities_5.mp4",
    },
    {
      id: "06",
      title: "Industrial + frontline tools",
      video: "/Videos/possibilities/possibilities_6.mp4",
    },
  ];

  const CONTENT_HEIGHT = 700;
  const VIDEO_SIZE = 520;

  const generateNotchPath = (index: number) => {
    const totalItems = deviceCategories.length;
    const minY = 80;
    const maxY = 520;
    const notchY = minY + ((maxY - minY) / (totalItems - 1)) * index;
    const notchHeight = 200;
    const notchDepth = 35;

    return `
      M 40,0 
      H 860 
      A 40,40 0 0 1 900,40 
      V 810 
      A 40,40 0 0 1 860,850 
      H 40 
      A 40,40 0 0 1 0,810 
      V ${notchY + notchHeight}
      L ${notchDepth},${notchY + notchHeight - 50}
      V ${notchY + 50}
      L 0,${notchY}
      V 40 
      A 40,40 0 0 1 40,0 
      Z
    `;
  };

  // Handle video switching
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === activeIndex) {
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [activeIndex]);

  useEffect(() => {
    if (!pinRef.current) return;

    const initTimeout = setTimeout(() => {
      ScrollTrigger.refresh();

      const gsapCtx = gsap.context(() => {
        const items = textItemsRef.current.filter(
          (el): el is HTMLDivElement => !!el
        );
        const videos = videoRefs.current.filter(
          (el): el is HTMLVideoElement => !!el
        );

        if (!items.length) return;

        // Initial text states - all visible but styled differently
        items.forEach((item, i) => {
          const numberEl = item.querySelector("[data-number]");
          const titleEl = item.querySelector("[data-title]");

          if (i === 0) {
            // Active item - full color
            gsap.set(numberEl, { color: THEME.primary });
            gsap.set(titleEl, { color: THEME.dark });
            gsap.set(item, { opacity: 1 });
          } else {
            // Inactive items - muted
            gsap.set(numberEl, { color: THEME.mutedLight });
            gsap.set(titleEl, { color: THEME.muted });
            gsap.set(item, { opacity: 1 });
          }
        });

        // Initial video states
        videos.forEach((video, i) => {
          gsap.set(video, {
            opacity: i === 0 ? 1 : 0,
            scale: i === 0 ? 1 : 0.95,
          });
        });

        // Initial notch + path
        if (notchRef.current) {
          gsap.set(notchRef.current, { y: 0, background: THEME.primary });
        }
        if (svgPathRef.current) {
          gsap.set(svgPathRef.current, { attr: { d: generateNotchPath(0) } });
        }

        let currentIdx = 0;

        ScrollTrigger.create({
          id: "possibilities-scroll-trigger",
          trigger: pinRef.current,
          start: "top top",
          end: `+=${deviceCategories.length * 350}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          refreshPriority: -1,
          onUpdate: (self) => {
            const progress = self.progress;
            const total = deviceCategories.length;
            const rawIndex = progress * total;
            let newIdx = Math.floor(rawIndex);
            newIdx = Math.max(0, Math.min(newIdx, total - 1));

            if (newIdx === currentIdx) return;

            const prevIdx = currentIdx;
            currentIdx = newIdx;
            setActiveIndex(newIdx);

            // Animate all text items
            items.forEach((item, i) => {
              const numberEl = item.querySelector("[data-number]");
              const titleEl = item.querySelector("[data-title]");

              if (i === newIdx) {
                // New active item - animate to full color
                gsap.to(numberEl, {
                  color: THEME.primary,
                  duration: 0.4,
                  ease: "power2.out",
                });
                gsap.to(titleEl, {
                  color: THEME.dark,
                  duration: 0.4,
                  ease: "power2.out",
                });
              } else {
                // Inactive items - animate to muted
                gsap.to(numberEl, {
                  color: THEME.mutedLight,
                  duration: 0.3,
                  ease: "power2.in",
                });
                gsap.to(titleEl, {
                  color: THEME.muted,
                  duration: 0.3,
                  ease: "power2.in",
                });
              }
            });

            // Animate videos
            const prevVideo = videos[prevIdx];
            const nextVideo = videos[newIdx];

            if (prevVideo) {
              gsap.to(prevVideo, {
                opacity: 0,
                scale: 0.95,
                duration: 0.4,
                ease: "power2.in",
              });
            }

            if (nextVideo) {
              gsap.to(nextVideo, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "power2.out",
              });
            }

            // Move left notch
            if (notchRef.current && trackRef.current) {
              const trackHeight = trackRef.current.offsetHeight;
              const indicatorHeight = 60;
              const maxTravel = trackHeight - indicatorHeight;
              const targetY = (newIdx / (total - 1)) * maxTravel;

              gsap.to(notchRef.current, {
                y: targetY,
                duration: 0.35,
                ease: "power2.out",
              });
            }

            // Update right path
            if (svgPathRef.current) {
              gsap.to(svgPathRef.current, {
                attr: { d: generateNotchPath(newIdx) },
                duration: 0.4,
                ease: "power2.inOut",
              });
            }
          },
        });
      }, pinRef);

      ctxRef.current = gsapCtx;
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, [deviceCategories.length]);

  // Handle hover effects on text items
  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    const item = textItemsRef.current[index];
    if (item && index !== activeIndex) {
      const numberEl = item.querySelector("[data-number]");
      const titleEl = item.querySelector("[data-title]");

      gsap.to(numberEl, {
        color: THEME.primary,
        duration: 0.25,
        ease: "power2.out",
      });
      gsap.to(titleEl, {
        color: THEME.dark,
        opacity: 0.7,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = (index: number) => {
    setHoveredIndex(null);
    const item = textItemsRef.current[index];
    if (item && index !== activeIndex) {
      const numberEl = item.querySelector("[data-number]");
      const titleEl = item.querySelector("[data-title]");

      gsap.to(numberEl, {
        color: THEME.mutedLight,
        duration: 0.25,
        ease: "power2.in",
      });
      gsap.to(titleEl, {
        color: THEME.muted,
        opacity: 1,
        duration: 0.25,
        ease: "power2.in",
      });
    }
  };

  return (
    <section ref={sectionRef} className="relative z-10 bg-white">
      {/* Top normal scroll section */}
      <div className="px-5 md:px-8 lg:px-12 xl:px-[50px] pt-16 lg:pt-24">
        <div className="max-w-[746px] mx-auto text-center pb-12 lg:pb-20">
          <AnimatedText
            text="Today, AI has no standard way to talk to the hardware devices"
            className="text-[28px] md:text-[36px] lg:text-[48px] xl:text-[55px] text-center break-keep leading-tight"
            fromColor="#10171730"
            toColor="#101717"
          />
        </div>
      </div>

      {/* Pinned block */}
      <div ref={pinRef} className="px-5 md:px-8 lg:px-12 xl:px-[50px] bg-white">
        <div
          className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-4"
          style={{ height: `${CONTENT_HEIGHT}px` }}
        >
          {/* LEFT: text list + notch indicator */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center relative">
            {/* Progress track indicator */}
            <div
              ref={trackRef}
              className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-full"
              style={{
                height: "320px",
                background: `linear-gradient(180deg, ${THEME.mutedLight} 0%, ${THEME.mutedLight} 100%)`,
              }}
            >
              <div
                ref={notchRef}
                className="absolute left-0 top-0 w-1 rounded-full"
                style={{
                  height: "60px",
                  background: `linear-gradient(180deg, ${THEME.primary} 0%, ${THEME.primary}90 100%)`,
                  boxShadow: `0 0 20px ${THEME.primary}40`,
                }}
              >
                <div
                  className="absolute -left-0.5 -top-1 w-2 h-2 rounded-full"
                  style={{ background: THEME.primary }}
                />
                <div
                  className="absolute -left-0.5 -bottom-1 w-2 h-2 rounded-full"
                  style={{ background: THEME.primary }}
                />
              </div>
            </div>

            <div className="pl-6 lg:pl-12">
              {/* Section heading */}
              <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-[54px] text-[#101717] font-semibold leading-tight mb-8 lg:mb-10">
                Possibilities are{" "}
                <span style={{ color: THEME.primary }}>Endless</span>
              </h3>

              {/* Text items list - all visible */}
              <div className="space-y-3 lg:space-y-4">
                {deviceCategories.map((item, index) => (
                  <div
                    key={item.id}
                    ref={(el) => {
                      textItemsRef.current[index] = el;
                    }}
                    className="flex gap-3 items-start cursor-pointer transition-transform duration-200 hover:translate-x-1"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                  >
                    <span
                      data-number
                      className="text-sm md:text-base font-semibold mt-1 min-w-[28px] tabular-nums transition-colors duration-300"
                      style={{
                        color:
                          index === activeIndex
                            ? THEME.primary
                            : THEME.mutedLight,
                      }}
                    >
                      {item.id}
                    </span>
                    <h4
                      data-title
                      className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-medium leading-[1.3] max-w-[420px] transition-colors duration-300"
                      style={{
                        color:
                          index === activeIndex ? THEME.dark : THEME.muted,
                      }}
                    >
                      {item.title}
                    </h4>
                  </div>
                ))}
              </div>

              {/* Progress indicator */}
              <div className="mt-10 flex items-center gap-3">
                <span
                  className="font-semibold tabular-nums text-sm"
                  style={{ color: THEME.primary }}
                >
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <div className="w-32 h-1 bg-[#10171715] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${
                        ((activeIndex + 1) / deviceCategories.length) * 100
                      }%`,
                      background: `linear-gradient(90deg, ${THEME.primary} 0%, ${THEME.primary}80 100%)`,
                      boxShadow: `0 0 10px ${THEME.primary}50`,
                    }}
                  />
                </div>
                <span
                  className="tabular-nums text-sm"
                  style={{ color: THEME.muted }}
                >
                  {String(deviceCategories.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Videos + SVG shape */}
          <div className="w-full lg:w-1/2 flex justify-center items-center">
            <div
              className="relative w-full max-w-[600px] flex items-center justify-center"
              style={{ height: `${CONTENT_HEIGHT}px` }}
            >
              {/* SVG Background Shape */}
              <svg
                className="absolute inset-0 w-full h-full z-10"
                viewBox="0 0 900 850"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  ref={svgPathRef}
                  d={generateNotchPath(0)}
                  fill="#020203"
                />
              </svg>


              {/* Videos container */}
              <div
                className="relative z-10"
                style={{
                  width: VIDEO_SIZE,
                  height: VIDEO_SIZE,
                  maxWidth: "85%",
                  maxHeight: "65%",
                }}
              >
                {deviceCategories.map((item, index) => (
                  <video
                    key={item.id}
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    style={{
                      opacity: index === 0 ? 1 : 0,
                      transform: index === 0 ? "scale(1)" : "scale(0.95)",
                    }}
                    src={item.video}
                    muted
                    loop
                    playsInline
                    preload="auto"
                  />
                ))}
              </div>

              {/* Subtle glow effect */}
              <div
                className="absolute z-5 rounded-full blur-3xl opacity-20"
                style={{
                  width: "300px",
                  height: "300px",
                  background: THEME.primary,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-20" />
    </section>
  );
}

export default Possibilities;