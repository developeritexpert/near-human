"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function TinyComputerVision() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ctxRef = useRef<gsap.Context | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const featuresData = [
    {
      id: 1,
      title: "Safety Features that redefine micromobility",
    },
    {
      id: 2,
      title: "AI-Powered Object Recognition with 99.9% accuracy",
    },
    {
      id: 3,
      title: "Ultra-Low Power Consumption for extended battery life",
    },
  ];

  useEffect(() => {
    // Start video playback when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Auto-play was prevented:", error);
      });
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up any existing ScrollTrigger
    ScrollTrigger.getById("tiny-cv-trigger")?.kill();

    const timeout = setTimeout(() => {
      const ctx = gsap.context(() => {
        const items = textItemsRef.current.filter(Boolean) as HTMLDivElement[];
        if (!items.length) return;

        // Set initial states for all items
        items.forEach((item, i) => {
          if (i === 0) {
            gsap.set(item, {
              autoAlpha: 1,
              y: 0,
            });
          } else {
            gsap.set(item, {
              autoAlpha: 0,
              y: 30,
            });
          }
        });

        let currentIdx = 0;

        // Create the ScrollTrigger
        ScrollTrigger.create({
          id: "tiny-cv-trigger",
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${featuresData.length * 400}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const total = featuresData.length;
            const rawIndex = progress * (total - 0.01); // Prevent reaching exact total
            let newIdx = Math.floor(rawIndex);
            newIdx = Math.max(0, Math.min(newIdx, total - 1));

            if (newIdx !== currentIdx) {
              const prevIdx = currentIdx;
              currentIdx = newIdx;
              setActiveIndex(newIdx);

              const prevItem = items[prevIdx];
              const nextItem = items[newIdx];

              // Create timeline for smooth transition
              const tl = gsap.timeline();

              // Fade out previous item
              if (prevItem) {
                tl.to(prevItem, {
                  autoAlpha: 0,
                  y: -30,
                  duration: 0.4,
                  ease: "power2.inOut",
                }, 0);
              }

              // Fade in next item
              if (nextItem) {
                tl.fromTo(nextItem, 
                  {
                    autoAlpha: 0,
                    y: 30,
                  },
                  {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out",
                  }, 
                  0.1
                );
              }
            }
          },
        });

        // Refresh ScrollTrigger after setup
        ScrollTrigger.refresh();
      }, containerRef);

      ctxRef.current = ctx;
    }, 200); // Slight delay to ensure DOM is ready

    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getById("tiny-cv-trigger")?.kill();
      ctxRef.current?.revert();
    };
  }, [featuresData.length]);

  return (
    <section className="relative">
      {/* Pinned Container */}
      <div
        ref={containerRef}
        className="relative min-h-screen bg-[#0A1016] overflow-hidden"
      >
        {/* Video Background Layer */}
        <div className="absolute inset-0 w-full h-full">
          {/* Video overlay gradients for text readability */}
          <div className="absolute inset-0 z-20">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A1016]/20 via-[#0A1016]/40 to-[#0A1016]/80"></div>
          </div>
          
          {/* Video Element */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ zIndex: 10 }}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/img/tiny-comp-bg-img.png"
          >
            <source src="/Videos/scootr/scootr_2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Content Layer */}
        <div className="relative z-30 min-h-screen flex flex-col justify-center px-[20px] md:px-[30px] lg:px-[50px] py-[50px] md:py-[90px] lg:py-[110px]">
          <div className="container max-w-[1440px] mx-auto w-full">
            {/* Header - Always Visible */}
            <div className="max-w-[760px] mx-auto mb-[40px] md:mb-[60px] lg:mb-[107px]">
              <h3 className="text-[28px] sm:text-[32px] md:text-[45px] lg:text-[57px] text-[#FFF] text-center font-[450] drop-shadow-2xl">
                Tiny Computer Vision Camera module
                <span className="text-[#00B0B2]"> packed with features</span>
              </h3>
            </div>

            {/* Features Container */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-[400px]" style={{ minHeight: "150px" }}>
                {featuresData.map((item, index) => (
                  <div
                    key={item.id}
                    ref={(el) => {
                      textItemsRef.current[index] = el;
                    }}
                    className="absolute top-0 left-0 right-0 flex flex-col items-center"
                    style={{
                      visibility: index === 0 ? "visible" : "hidden",
                      opacity: index === 0 ? 1 : 0,
                    }}
                  >
                    {/* Number Circle */}
                    <div className="h-[43px] w-[43px] border-2 border-[#00B0B2] rounded-full flex justify-center items-center text-[#00B0B2] bg-[#0A1016]/80 backdrop-blur-sm shadow-lg">
                      {item.id}
                    </div>
                    
                    {/* Title Text */}
                    <p className="mt-[19px] text-[26px] font-[450] text-white text-center drop-shadow-2xl px-4">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Dots */}
            <div className="mt-[50px] flex justify-center items-center gap-[10px]">
              {featuresData.map((_, index) => (
                <div
                  key={index}
                  className="relative"
                >
                  <div
                    className={`w-[8px] h-[8px] rounded-full transition-all duration-500 ${
                      index === activeIndex 
                        ? "bg-[#00B0B2] scale-125" 
                        : "bg-white/30 scale-100"
                    }`}
                  />
                  {index === activeIndex && (
                    <div className="absolute inset-0 w-[8px] h-[8px] rounded-full bg-[#00B0B2] animate-ping" />
                  )}
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="mt-[30px] flex justify-center">
              <div className="text-white/40 text-sm animate-bounce">
                ↓ Scroll to explore
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TinyComputerVision;