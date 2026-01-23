"use client";

import React, { useEffect, useRef, useState } from "react";
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

  const generateNotchPath = (progress: number) => {
    // progress is 0 to 2 (since 3 items, 2 intervals)
    const minY = 150; // Starting Y position
    const totalTravel = 250; // Total distance to travel down
    const notchY = minY + (progress / 2) * totalTravel;

    const notchHeight = 220;
    const notchDepth = 35;

    return `
      M 0 0
      H ${notchDepth}
      V ${notchY}
      L ${notchDepth + 20} ${notchY + 40}
      V ${notchY + notchHeight - 40}
      L ${notchDepth} ${notchY + notchHeight}
      V 700
      H 0
      Z
    `;
  };

  // Mark component as ready after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady || !pinRef.current) return;

    let ctx: gsap.Context = gsap.context(() => {
      const texts = textItemsRef.current;
      const videos = videoItemsRef.current;

      // Initial States for Texts
      gsap.set(texts, { opacity: 0, display: "none" });
      gsap.set(texts[0], { opacity: 1, display: "block" });

      // Initial States for Videos
      // Stack videos: zIndex increases
      gsap.set(videos, { zIndex: (i) => i + 1, opacity: 0 });
      gsap.set(videos[0], { opacity: 1 });

      if (svgPathRef.current) {
        gsap.set(svgPathRef.current, { attr: { d: generateNotchPath(0) } });
      }

      const totalSections = statisticsData.length;
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: `+=${totalSections * 700}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Transition 0 -> 1
      timeline
        // Text 0 fades out
        .to(texts[0], { opacity: 0, duration: 0.5 }, 0)
        .set(texts[0], { display: "none" }, 0.5)
        
        // Text 1 fades in
        .set(texts[1], { display: "block" }, 0.5)
        .to(texts[1], { opacity: 1, duration: 0.5 }, 0.5)
        
        // Video 1 fades in ON TOP of Video 0 (Direct fade)
        .to(videos[1], { opacity: 1, duration: 0.5 }, 0.25) // Start fade slightly into the transition
        
        // Match notch animation
        .to(svgPathRef.current, {
           attr: { d: generateNotchPath(1) },
           ease: "none",
           duration: 1
        }, 0);

      // Transition 1 -> 2
      timeline
        // Text 1 fades out
        .to(texts[1], { opacity: 0, duration: 0.5 }, 1)
        .set(texts[1], { display: "none" }, 1.5)
        
        // Text 2 fades in
        .set(texts[2], { display: "block" }, 1.5)
        .to(texts[2], { opacity: 1, duration: 0.5 }, 1.5)

        // Video 2 fades in ON TOP of Video 1
        .to(videos[2], { opacity: 1, duration: 0.5 }, 1.25)

         // Match notch animation
        .to(svgPathRef.current, {
           attr: { d: generateNotchPath(2) },
           ease: "none",
           duration: 1
        }, 1);

    }, pinRef);

    return () => ctx.revert();
  }, [isReady]);


  return (
    <section ref={sectionRef} className="relative z-10 bg-white">
      <div ref={pinRef} className="px-[20px] md:px-[30px] lg:px-[50px] bg-white h-screen flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center w-full max-w-[1600px] mx-auto">
          
          {/* LEFT: Statistics */}
          <div className="w-full lg:w-1/2 flex items-center relative h-full order-2 lg:order-1 mt-10 lg:mt-0">
            <div className="lg:pl-[50px] xl:pl-[100px] 2xl:pl-[200px] w-full">
             <div className="relative min-h-[250px] md:min-h-[300px]">
                {statisticsData.map((item, index) => (
                  <div
                    key={item.id}
                    ref={(el) => {
                      textItemsRef.current[index] = el;
                    }}
                    className="absolute top-0 left-0 w-full lg:max-w-[450px]"
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
            </div>
          </div>

          {/* RIGHT: Video */}
          <div className="w-full lg:w-1/2 flex justify-center items-center order-1 lg:order-2">
            <div className="relative w-full lg:w-[90%] xl:w-full aspect-[900/700] rounded-xl overflow-hidden">
                
                {/* VIDEOS STACK */}
                {statisticsData.map((item, index) => (
                    <div 
                        key={item.id}
                        ref={(el) => { videoItemsRef.current[index] = el; }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <video
                            className="w-full h-full object-cover pointer-events-none"
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
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
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
                className="absolute rounded-full blur-3xl z-0 pointer-events-none"
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