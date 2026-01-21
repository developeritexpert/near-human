"use client";

import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  const trackRef = useRef<HTMLDivElement>(null);
  const notchRef = useRef<HTMLDivElement>(null);
  const svgPathRef = useRef<SVGPathElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const statisticsData = [
    {
      id: "01",
      number: "30,000+",
      description: "injuries in the UK and EU alone",
    },
    {
      id: "02",
      number: "1,300",
      description:
        "reported casualties in the UK alone, costing the NHS and Insurers ~£7M",
    },
    {
      id: "03",
      number: "9,425",
      description:
        "Germany reported 9,425 E-Scooter accidents, marking a 14.1% increase from the previous year.",
    },
  ];

  const CONTENT_HEIGHT = 700;
  const VIDEO_SIZE = 450;

  const generateNotchPath = (index: number) => {
    const totalItems = statisticsData.length;
    const minY = 150;
    const maxY = 400;
    const notchY = minY + ((maxY - minY) / (totalItems - 1)) * index;
    const notchHeight = 220;
    const notchDepth = 35;

    return `
      M 40,0 
      H 860 
      A 40,40 0 0 1 900,40 
      V 660 
      A 40,40 0 0 1 860,700 
      H 40 
      A 40,40 0 0 1 0,660 
      V ${notchY + notchHeight}
      L ${notchDepth},${notchY + notchHeight - 55}
      V ${notchY + 55}
      L 0,${notchY}
      V 40 
      A 40,40 0 0 1 40,0 
      Z
    `;
  };

  // Video autoplay
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
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

    // Kill existing trigger for this component
    const existingTrigger = ScrollTrigger.getById("sidevideo-scroll-trigger");
    if (existingTrigger) {
      existingTrigger.kill();
    }

    let ctx: gsap.Context | null = null;
    let currentIdx = 0;

    const initScrollTrigger = () => {
      ctx = gsap.context(() => {
        const items = textItemsRef.current.filter(
          (el): el is HTMLDivElement => !!el
        );

        if (!items.length) return;

        // Set initial states
        items.forEach((item, i) => {
          gsap.set(item, {
            opacity: i === 0 ? 1 : 0,
            y: i === 0 ? 0 : 40,
            scale: i === 0 ? 1 : 0.95,
            display: i === 0 ? "block" : "none",
          });
        });

        if (notchRef.current) {
          gsap.set(notchRef.current, { y: 0 });
        }
        if (svgPathRef.current) {
          gsap.set(svgPathRef.current, { attr: { d: generateNotchPath(0) } });
        }

        ScrollTrigger.create({
          id: "sidevideo-scroll-trigger",
          trigger: pinRef.current,
          start: "top top",
          end: `+=${statisticsData.length * 500}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const total = statisticsData.length;
            const rawIndex = progress * total;
            let newIdx = Math.floor(rawIndex);
            newIdx = Math.max(0, Math.min(newIdx, total - 1));

            if (newIdx === currentIdx) return;

            const prevIdx = currentIdx;
            currentIdx = newIdx;
            setActiveIndex(newIdx);

            const prevItem = items[prevIdx];
            const nextItem = items[newIdx];

            const tl = gsap.timeline();

            if (prevItem) {
              tl.to(
                prevItem,
                {
                  opacity: 0,
                  y: -30,
                  scale: 0.98,
                  duration: 0.4,
                  ease: "power2.in",
                  onComplete: () => {
                    gsap.set(prevItem, { display: "none" });
                  },
                },
                0
              );
            }

            if (nextItem) {
              gsap.set(nextItem, {
                display: "block",
                opacity: 0,
                y: 40,
                scale: 0.95,
              });

              tl.to(
                nextItem,
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.5,
                  ease: "power2.out",
                },
                0.15
              );
            }

            if (notchRef.current && trackRef.current) {
              const trackHeight = trackRef.current.offsetHeight;
              const indicatorHeight = 70;
              const maxTravel = trackHeight - indicatorHeight;
              const targetY = (newIdx / (total - 1)) * maxTravel;

              tl.to(
                notchRef.current,
                {
                  y: targetY,
                  duration: 0.45,
                  ease: "power2.inOut",
                },
                0
              );
            }

            if (svgPathRef.current) {
              tl.to(
                svgPathRef.current,
                {
                  attr: { d: generateNotchPath(newIdx) },
                  duration: 0.5,
                  ease: "power2.inOut",
                },
                0
              );
            }
          },
        });
      }, pinRef);
    };

    // Use requestAnimationFrame for better timing
    const rafId = requestAnimationFrame(() => {
      const timer = setTimeout(() => {
        initScrollTrigger();
        ScrollTrigger.refresh();
      }, 250);

      return () => clearTimeout(timer);
    });

    return () => {
      cancelAnimationFrame(rafId);
      ScrollTrigger.getById("sidevideo-scroll-trigger")?.kill();
      if (ctx) {
        ctx.revert();
      }
    };
  }, [isReady]);


  return (
    <section ref={sectionRef} className="relative z-10 bg-white">
      <div ref={pinRef} className="px-[20px] md:px-[30px] lg:px-[50px] bg-white">
        <div
          className="flex flex-col lg:flex-row items-center"
          style={{
            minHeight: `${CONTENT_HEIGHT}px`,
            paddingTop: "80px",
            paddingBottom: "80px",
          }}
        >
          {/* LEFT: Statistics */}
          <div className="w-full lg:w-1/2 flex items-center relative h-full">
            {/* Parallelogram scroll track */}
            <div
              ref={trackRef}
              className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2"
              style={{ height: "200px", width: "4px" }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: "#E8E8E8",
                  clipPath: "polygon(0 8px, 100% 0, 100% calc(100% - 8px), 0 100%)",
                }}
              />

              <div
                ref={notchRef}
                className="absolute left-0 top-0"
                style={{ height: "70px", width: "4px" }}
              >
                <div
                  className="w-full h-full"
                  style={{
                    background: THEME.primary,
                    clipPath: "polygon(0 6px, 100% 0, 100% calc(100% - 6px), 0 100%)",
                    boxShadow: `0 0 12px ${THEME.primary}60`,
                  }}
                />
                <div
                  className="absolute -top-2 left-1/2 -translate-x-1/2"
                  style={{
                    width: "10px",
                    height: "10px",
                    background: THEME.primary,
                    clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0 100%)",
                  }}
                />
                <div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                  style={{
                    width: "10px",
                    height: "10px",
                    background: THEME.primary,
                    clipPath: "polygon(0 0, 100% 0, 80% 100%, 20% 100%)",
                  }}
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="lg:pl-[50px] xl:pl-[100px] 2xl:pl-[200px] w-full">
              <div
                ref={textContainerRef}
                className="relative"
                style={{ minHeight: "280px" }}
              >
                {statisticsData.map((item, index) => (
                  <div
                    key={item.id}
                    ref={(el) => {
                      textItemsRef.current[index] = el;
                    }}
                    className="absolute top-0 left-0 w-full lg:max-w-[450px]"
                    style={{
                      opacity: index === 0 ? 1 : 0,
                      display: index === 0 ? "block" : "none",
                    }}
                  >
                    <h2 className="mb-[8px] text-[36px] md:text-[50px] lg:text-[60px] xl:text-[77px] font-[450] leading-tight text-[#101717]">
                      {item.number}
                    </h2>
                    <p className="text-[18px] md:text-[22px] xl:text-[25px] font-normal leading-relaxed text-[#101717]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-6 flex items-center gap-3">
                <span
                  className="font-semibold tabular-nums text-sm"
                  style={{ color: THEME.primary }}
                >
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <div className="w-24 lg:w-28 h-1 bg-[#E5E5E5] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${((activeIndex + 1) / statisticsData.length) * 100}%`,
                      background: THEME.primary,
                      boxShadow: `0 0 8px ${THEME.primary}60`,
                    }}
                  />
                </div>
                <span
                  className="tabular-nums text-sm"
                  style={{ color: THEME.mutedText }}
                >
                  {String(statisticsData.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Video */}
          <div className="w-full lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0">
            <div
              className="relative w-full max-w-[600px] flex items-center justify-center"
              style={{ height: `${CONTENT_HEIGHT}px` }}
            >
              {/* SVG Background */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 900 700"
                preserveAspectRatio="xMidYMid meet"
                style={{ zIndex: 1 }}
              >
                <path
                  ref={svgPathRef}
                  d={generateNotchPath(0)}
                  fill="#020203"
                />
              </svg>

              {/* Video */}
              <div
                className="relative"
                style={{
                  width: VIDEO_SIZE,
                  height: VIDEO_SIZE,
                  maxWidth: "80%",
                  maxHeight: "60%",
                  zIndex: 10,
                }}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain pointer-events-none"
                  src="/Videos/scootr/scottr.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                />
              </div>

              {/* Glow effect */}
              <div
                className="absolute rounded-full blur-3xl"
                style={{
                  width: "200px",
                  height: "200px",
                  background: THEME.primary,
                  opacity: 0.15,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 5,
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