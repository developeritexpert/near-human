"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useSmokeEffect } from "./hooks/useSmokeEffect";
import { useCustomCursor } from "./hooks/useCustomCursor";

// Register plugin once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -----------------------------------------------------------------------------
// CONFIGURATION
// -----------------------------------------------------------------------------
const CONFIG = {
  video: {
    src: "/Videos/scrub-video.mp4",
    duration: 29.37, // Duration from metadata
  },
  animation: {
    scrollDistance: "+=500%",
    scrub: 0.5, // Increased smoothing for mouse wheel
  },
  colors: {
    highlight1: "#00B0B2",
    highlight2: "#FF6B9D",
    textPrimary: "#FFFFFF",
  },
  particles: {
    count: 80,
  },
};

const TEXT_STEPS = [
  {
    id: 1,
    text: "THE NEXT EVOLUTION",
    highlightIndex: 2,
    highlightColor: CONFIG.colors.highlight1,
  },
  {
    id: 2,
    text: "OF HUMAN POTENTIAL",
    highlightIndex: 1,
    highlightColor: CONFIG.colors.highlight2,
  },
  {
    id: 3,
    text: "IS HERE NOW",
    highlightIndex: 2,
    highlightColor: CONFIG.colors.textPrimary,
  },
  {
    id: 4,
    text: "", // Final resolve state
    highlightIndex: 0,
    highlightColor: CONFIG.colors.highlight1,
  }
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const smokeCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  
  const [mounted, setMounted] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Smoke Effect
  useSmokeEffect({
    canvasRef: smokeCanvasRef,
    containerRef,
    maxParticles: CONFIG.particles.count,
    enabled: mounted,
  });

  // 2. Custom Cursor
  useCustomCursor({
    containerRef,
    cursorRef,
    cursorDotRef,
    enabled: mounted,
  });

  // 3. Scroll Animation Logic
  useGSAP(() => {
    if (!mounted || !containerRef.current || !videoRef.current) return;

    const video = videoRef.current;

    // Ensure video is paused immediately
    video.pause();
    
    // Master Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: CONFIG.animation.scrollDistance,
        scrub: 1, // Smoother scrubbing (1 second delay)
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // 1. Video Scrubbing
    // Ensure we have a valid duration to scrub to
    const targetDuration = video.duration && !isNaN(video.duration) && video.duration > 0
        ? video.duration 
        : CONFIG.video.duration;

    tl.fromTo(
      video,
      { currentTime: 0 },
      { 
        currentTime: targetDuration - 0.1, // Slight buffer to avoid end glitch
        duration: 1,
        ease: "none" 
      },
      0
    );
      
  }, [mounted, videoLoaded]); // Re-run when video loads to ensure correct duration

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    // Explicitly update ScrollTrigger after load
    ScrollTrigger.refresh();
  };
  
  // Robust loading strategy
  useEffect(() => {
    const checkVideoState = () => {
        if (videoRef.current && videoRef.current.readyState >= 3) {
            setVideoLoaded(true);
            ScrollTrigger.refresh();
        } else {
            requestAnimationFrame(checkVideoState);
        }
    };
    
    // Start periodic check
    const id = requestAnimationFrame(checkVideoState);
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) return null;

  return (
    <section 
        ref={containerRef} 
        className="relative w-full overflow-hidden bg-black cursor-none"
        aria-label="Interactive Hero Animation"
        style={{ backgroundColor: '#000000' }} // Force black background
    >
       {!videoLoaded && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-[#00B0B2]">
            Loading Experience...
         </div>
       )}

      <div className="relative h-screen w-full bg-black">
        {/* Main Video */}
        <video
            ref={videoRef}
            src={CONFIG.video.src}
            className="absolute inset-0 block h-full w-full object-cover"
            preload="auto"
            muted
            playsInline
            loop={false}
            onLoadedMetadata={handleVideoLoad}
        />
        
        {/* Smoke Canvas */}
        <canvas ref={smokeCanvasRef} className="absolute inset-0 z-10 pointer-events-none mix-blend-screen" />

        {/* Overlays */}
        <div className="absolute inset-0 z-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0.6) 100%)' }}
        />
        <div className="absolute top-0 left-0 right-0 h-[20%] z-20 pointer-events-none"
             style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-[20%] z-20 pointer-events-none"
             style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.5) 0%, transparent 100%)' }} />

        {/* Custom Cursor */}
        <div ref={cursorRef} className="pointer-events-none fixed top-0 left-0 z-[100] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#00B0B2] opacity-0 mix-blend-screen shadow-[0_0_20px_rgba(0,176,178,0.4),inset_0_0_20px_rgba(0,176,178,0.2)]" />
        <div ref={cursorDotRef} className="pointer-events-none fixed top-0 left-0 z-[100] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00B0B2] opacity-0 shadow-[0_0_10px_#00B0B2]" />

        {/* Text Segments - HIDDEN */}
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          {TEXT_STEPS.map((step) => (
            <div
              key={step.id}
              data-hero-step={step.id}
              className="absolute flex flex-wrap justify-center gap-x-3 gap-y-2 px-4 max-w-6xl"
              style={{ opacity: 0, visibility: "hidden" }}
            >
              {step.text && step.text.split(" ").map((word, wi) => {
                  const isHighlight = wi === step.highlightIndex;
                  return (
                    <span
                      key={wi}
                      data-hero-word={wi}
                      className="inline-block"
                      style={{
                        fontSize: "clamp(2.5rem, 8vw, 6rem)",
                        fontWeight: 700,
                        lineHeight: 1.1,
                        color: isHighlight ? step.highlightColor : CONFIG.colors.textPrimary,
                        textShadow: isHighlight ? `0 0 40px ${step.highlightColor}55` : "0 2px 20px rgba(0,0,0,0.6)",
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
