"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AIDevices = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const aiStandardRef = useRef<HTMLDivElement | null>(null);
  const devicesRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const imgContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const videos = [
    "/Videos/vid_1.mp4",
    "/Videos/vid_2.mp4",
    "/Videos/vid_3.mp4",
    "/Videos/vid_4.mp4",
    "/Videos/vid_5.mp4",
    "/Videos/vid_6.mp4",
  ];

  const contentItems = [
    {
      number: "01",
      title: "Autonomous, integrated workflows starting at the gate",
    },
    {
      number: "02",
      title: "Single pane of glass visibility of all yard operations",
    },
    {
      number: "03",
      title: "Managed by a unified platform with AI computer vision",
    },
    { number: "04", title: "Highly configurable to all yards in your network" },
    { number: "05", title: "Unlocked value of your existing WMS/TMS" },
    { number: "06", title: "Digitally transformed, data rich, and predictive" },
  ];

  useEffect(() => {
    if (
      !containerRef.current ||
      !contentRef.current ||
      !aiStandardRef.current ||
      !devicesRef.current
    )
      return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(
        contentRef.current!.children as unknown as HTMLElement[]
      );

      // Initial States
      gsap.set(aiStandardRef.current, { autoAlpha: 1 });
      gsap.set(devicesRef.current, { autoAlpha: 0 });
      gsap.set(items, { autoAlpha: 0, y: 50 });

      // Hide all videos initially
      videoRefs.current.forEach((vid) => {
        if (vid) gsap.set(vid, { autoAlpha: 0 });
      });

      // Calculate timeline positions
      const introPhase = 2; // Time for AIStandard fade out + devices fade in
      const itemDuration = 1; // Each item gets 1 second
      const totalItemsTime = items.length * itemDuration; // 6 seconds for 6 items
      const holdTime = 2.5; // Hold last frame longer before unpinning

      // Create one unified timeline
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=600%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Phase 1: Fade out AIStandard text (0-1)
      masterTl.to(
        aiStandardRef.current,
        {
          autoAlpha: 0,
          y: -30,
          duration: 1,
          ease: "power2.inOut",
        },
        0
      );

      // Phase 2: Fade in devices section (0.5-1.5)
      masterTl.to(
        devicesRef.current,
        {
          autoAlpha: 1,
          duration: 1,
          ease: "power2.inOut",
        },
        0.5
      );

      // Phase 3: Animate through all items with equal timing
      items.forEach((item, i) => {
        const itemStartTime = introPhase + i * itemDuration;

        // Fade in current item
        masterTl.to(
          item,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          itemStartTime
        );

        // Fade in corresponding video
        masterTl.to(
          videoRefs.current[i],
          {
            autoAlpha: 1,
            duration: 0.4,
          },
          itemStartTime + 0.1
        );

        // Fade out previous video (if not first item)
        if (i > 0) {
          masterTl.to(
            videoRefs.current[i - 1],
            {
              autoAlpha: 0,
              duration: 0.4,
            },
            itemStartTime + 0.1
          );
        }

        // Fade out current item (if not last item)
        if (i < items.length - 1) {
          masterTl.to(
            item,
            {
              autoAlpha: 0,
              y: -50,
              duration: 0.6,
              ease: "power2.in",
            },
            itemStartTime + itemDuration - 0.4
          );
        }
      });

      // Clip path animation throughout
      masterTl.to(
        imgContainerRef.current,
        {
          clipPath:
            "polygon(7% 50%, 0 45%, 0 0, 85% 0%, 100% 0, 100% 25%, 100% 85%, 100% 100%, 85% 100%, 0 100%, 0 90%, 7% 85%)",
          ease: "none",
          duration: totalItemsTime,
        },
        introPhase
      );

      // Hold the last frame - keep it visible before unpinning
      masterTl.to({}, { duration: holdTime });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-white"
    >
      {/* AIStandard Text - Initially Visible */}
      <div
        ref={aiStandardRef}
        className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl leading-tight font-bold tracking-tight md:text-6xl">
            <span className="mb-2 block text-black">
              Today, AI has <span className="text-[#00B0B2]">no standard</span>
            </span>
            <span className="block text-zinc-700">
              way to talk to the hardware
            </span>
            <span className="block text-zinc-700">devices</span>
          </h2>
        </div>
      </div>

      {/* AIDevices Content - Initially Hidden */}
      <div
        ref={devicesRef}
        className="absolute inset-0 flex flex-col items-center gap-10 px-6 md:flex-row md:px-12"
      >
        {/* Text Section */}
        <div className="flex w-full items-center justify-center md:w-1/2">
          <div className="relative h-[200px] w-full max-w-md" ref={contentRef}>
            {contentItems.map((item, index) => (
              <div
                key={index}
                className="absolute top-0 left-0 flex w-full items-start gap-4"
              >
                <span className="mt-2 shrink-0 text-base font-semibold text-gray-400">
                  {item.number}
                </span>
                <h2 className="mb-2 px-6 text-3xl font-semibold text-[#0e3431]">
                  {item.title}
                </h2>
              </div>
            ))}
          </div>
        </div>

        {/* Video Section */}
        <div className="flex w-full justify-center md:w-1/2 md:justify-end">
          <div
            ref={imgContainerRef}
            className="relative overflow-hidden rounded-[36px] drop-shadow-2xl"
            style={{
              width: "100%",
              maxWidth: "44vw",
              height: "550px",
              clipPath:
                "polygon(7% 10%, 0 6%, 0 0, 85% 0%, 100% 0, 100% 15%, 100% 85%, 100% 100%, 85% 100%, 0 100%, 0 31%, 7% 26%)",
            }}
          >
            {videos.map((video, index) => (
              <video
                key={index}
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                autoPlay
                loop
                muted
                playsInline
                preload={index === 0 ? "auto" : "none"}
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src={video} type="video/mp4" />
              </video>
            ))}
            <div className="pointer-events-none absolute inset-0 z-20 rounded-[36px] border border-black" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIDevices;
