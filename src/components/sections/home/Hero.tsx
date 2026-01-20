"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useImageSequence } from "./hooks/useImageSequence";
import { useCanvasRenderer } from "./hooks/useCanvasRenderer";
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
  frames: {
    total: 416,
    path: (i: number) => `/hero-banner/frame_${String(i + 1).padStart(3, "0")}.avif`,
  },
  animation: {
    scrollDistance: "+=500%",
    scrub: 0.5,
  },
  colors: {
    highlight1: "#00B0B2",
    highlight2: "#FF6B9D",
    textPrimary: "#FFFFFF",
  },
  particles: {
    count: 80, // Reduced from 180 for performance
  },
};

const TEXT_STEPS = [
  {
    id: 1,
    text: "",
    highlightIndex: 2,
    highlightColor: CONFIG.colors.highlight1,
  },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smokeCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  
  // GSAP Animation State
  const frameIndexRef = useRef({ value: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Image Sequence Loading
  const { images, progress, isLoading, error } = useImageSequence({
    totalFrames: CONFIG.frames.total,
    framePath: CONFIG.frames.path,
  });

  // 2. Canvas Rendering
  const { drawFrame } = useCanvasRenderer({
    canvasRef,
    images,
    isLoading,
    maxDpr: 5.0, // Uncapped for maximum quality
    filter: "brightness(1.05) contrast(1.15) saturate(1.1)",
  });

  // 3. Smoke Effect
  useSmokeEffect({
    canvasRef: smokeCanvasRef,
    containerRef,
    maxParticles: CONFIG.particles.count,
    enabled: mounted,
  });

  // 4. Custom Cursor
  useCustomCursor({
    containerRef,
    cursorRef,
    cursorDotRef,
    enabled: mounted,
  });

  // 5. Scroll Animation Logic
  useGSAP(() => {
    if (isLoading || !containerRef.current || !images.length) return;

    // Initial render
    drawFrame(0);

    // Reduced Motion Check
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: CONFIG.animation.scrollDistance,
        scrub: CONFIG.animation.scrub,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: () => {
           drawFrame(frameIndexRef.current.value);
        },
      },
    });

    // Tween the frame index object
    tl.to(frameIndexRef.current, {
      value: CONFIG.frames.total - 1,
      ease: "none",
      duration: 1,
    });

    // Text Animations
    gsap.set("[data-hero-step]", { opacity: 0, visibility: "hidden", y: 0 });
    gsap.set("[data-hero-word]", { opacity: 0, y: 30, filter: "blur(10px)" });

    TEXT_STEPS.forEach((step, i) => {
        const start = i / TEXT_STEPS.length;
        const dur = 1 / TEXT_STEPS.length;

        if (step.text) {
          // Reveal Text Block
          tl.to(
            `[data-hero-step="${step.id}"]`,
            { opacity: 1, visibility: "visible", duration: 0.01 },
            start
          );

          // Reveal Words
          const words = step.text.split(" ");
          const wordDelay = (dur * 0.6) / words.length;

          words.forEach((_, wi) => {
            tl.to(
              `[data-hero-step="${step.id}"] [data-hero-word="${wi}"]`,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.2,
                ease: "power2.out",
              },
              start + 0.05 + wi * wordDelay
            );
          });

          // Hide Text Block
          if (i < TEXT_STEPS.length - 1) {
            tl.to(
              `[data-hero-step="${step.id}"]`,
              { opacity: 0, duration: 0.15, ease: "power2.in" },
              start + dur * 0.85
            );
            tl.set(
              `[data-hero-step="${step.id}"]`,
              { visibility: "hidden" },
              start + dur * 0.95
            );
            tl.set(
              `[data-hero-step="${step.id}"] [data-hero-word]`,
              { opacity: 0, y: 30, filter: "blur(10px)" },
              start + dur * 0.95
            );
          }
        }
      });
  }, [isLoading, drawFrame, images]); 



  if (!mounted) return null;

  if (error) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-black text-red-500">
           <p>Failed to load animation resources. Please refresh.</p>
        </div>
     );
  }

  return (
    <section 
        ref={containerRef} 
        className="relative w-full overflow-hidden bg-black cursor-none"
        aria-label="Interactive Hero Animation"
    >
       {/* LOADING SCREEN */}
       {isLoading && (
        <div 
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
            role="progressbar" 
            aria-valuenow={progress} 
            aria-valuemin={0} 
            aria-valuemax={100}
        >
          <div className="mb-4 text-2xl font-bold tracking-widest text-[#00B0B2]">
             INITIALIZING
          </div>
          <div className="h-1 w-64 overflow-hidden rounded-full bg-gray-800">
             <div 
               className="h-full bg-[#00B0B2] transition-all duration-300 ease-out"
               style={{ width: `${progress}%` }}
             />
          </div>
          <div className="mt-2 text-sm font-mono text-gray-400">
            {progress}%
          </div>
        </div>
      )}

      <div className="sticky top-0 h-screen w-full">
        {/* Main Canvas */}
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 block h-full w-full object-cover"
            style={{ width: '100%', height: '100%' }}
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

        {/* Text Segments */}
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
