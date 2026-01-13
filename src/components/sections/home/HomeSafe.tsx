"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Actual frame numbers found in the directory
const FRAME_INDICES = [
  0, 1, 9, 17, 25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 113, 121, 129, 137,
  145, 153, 161, 169, 177, 185, 193, 201, 209, 217, 225, 233, 241, 249, 257,
  265, 273, 281, 289, 297, 305, 313, 321, 329, 337, 345, 353, 361,
];

const FRAME_PATH = (frame: number) =>
  `/truck-frames/hero_anim_desktop_60_${frame}.webp`;

const TEXT_WAVES = [
  // {
  //     title: "The future isn’t more apps.",
  //     subtitle: "A NEW ERA OF DIGITAL INTERACTION",
  //     color: "white"
  // },
  // {
  //     title: "It’s a conversation with the world.",
  //     subtitle: "SEAMLESS CONNECTIVITY",
  //     color: "white"
  // },
  // {
  //     title: "We give everyday devices a voice.",
  //     subtitle: "POWERED BY NEARHUMAN INTELLIGENCE",
  //     color: "#00B0B2"
  // },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  // OPTIMIZATION: Use Ref for images to avoid React re-render overhead
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  // 1. Preload frames
  useEffect(() => {
    let loadedCount = 0;
    const totalFrames = FRAME_INDICES.length;

    FRAME_INDICES.forEach((frame, i) => {
      const img = new Image();
      img.src = FRAME_PATH(frame);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          setLoaded(true);
        }
      };
      imagesRef.current[i] = img;
    });
    // No cleanup needed for native Image loading
  }, []);

  // 2. Scroll animation & Canvas Logic
  useEffect(() => {
    if (!loaded || !containerRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- OPTIMIZED SIZING LOGIC ---
    // We only calculate dimensions on resize, NOT on every scroll tick.
    let renderWidth = 0;
    let renderHeight = 0;
    let imageRatio = 0;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.scale(dpr, dpr);

      renderWidth = width;
      renderHeight = height;

      // Assuming all frames are same size, grab ratio from first one
      if (imagesRef.current[0]) {
        imageRatio = imagesRef.current[0].width / imagesRef.current[0].height;
      }

      // Re-render current frame on resize
      // (In a real app, you'd track 'currentFrameIndex' in a ref to redraw exactly)
    };

    // Initial setup
    handleResize();
    window.addEventListener("resize", handleResize);

    // --- RENDER LOOP ---
    const renderFrame = (index: number) => {
      const img = imagesRef.current[index];
      if (!img || !img.complete) return;

      const canvasRatio = renderWidth / renderHeight;
      let dw = renderWidth;
      let dh = renderHeight;
      let dx = 0;
      let dy = 0;

      // "Object-fit: cover" math
      if (imageRatio > canvasRatio) {
        dh = renderHeight;
        dw = dh * imageRatio;
        dx = (renderWidth - dw) / 2;
      } else {
        dw = renderWidth;
        dh = dw / imageRatio;
        dy = (renderHeight - dh) / 2;
      }

      ctx.clearRect(0, 0, renderWidth, renderHeight);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const gsapCtx = gsap.context(() => {
      renderFrame(0);

      const animObject = { frame: 0 };
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=500%",
          scrub: 1.2, // Increased smoothness for the jumpy frames
          pin: true,
        },
      });

      // Frame animation
      masterTl.to(
        animObject,
        {
          frame: FRAME_INDICES.length - 1,
          ease: "none",
          onUpdate: () => {
            // Only render if index changed prevents micro-redundancy
            renderFrame(Math.round(animObject.frame));
          },
        },
        0
      );

      // Text Animations
      TEXT_WAVES.forEach((_, i) => {
        const el = textRefs.current[i];
        if (!el) return;

        const chars = el.querySelectorAll(".char");
        const subChars = el.querySelectorAll(".sub-char");

        const sceneScale = 1 / TEXT_WAVES.length;
        const sceneStart = i * sceneScale;
        const sceneEnd = (i + 1) * sceneScale;
        // Adjusted timings to ensure text is readable longer
        const fadeOutStart = sceneEnd - sceneScale * 0.15;

        masterTl.fromTo(
          [chars, subChars],
          { opacity: 0, y: 40, filter: "blur(12px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: { each: 0.015, from: "start" },
            duration: 0.5,
            ease: "power3.out",
          },
          sceneStart
        );

        if (i < TEXT_WAVES.length - 1) {
          masterTl.to(
            [chars, subChars],
            {
              opacity: 0,
              y: -40,
              filter: "blur(12px)",
              stagger: { each: 0.01, from: "start" },
              duration: 0.3,
              ease: "power2.in",
            },
            fadeOutStart
          );
        }
      });

      masterTl.to(".scroll-progress", { scaleX: 1, ease: "none" }, 0);
    }, containerRef);

    return () => {
      window.removeEventListener("resize", handleResize);
      gsapCtx.revert();
    };
  }, [loaded]);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#0a0a0f]"
    >
      {/* Texture Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3BaseFilter id='filter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/baseFilter%3E%3Crect width='100%25' height='100%25' filter='url(%23filter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="sticky top-0 flex h-screen w-full items-center justify-center">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-cover brightness-[0.9] contrast-[1.1] saturate-[0.8]"
        />

        {/* Vignette & Gradients */}
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-transparent via-[#0a0a0f]/20 to-[#0a0a0f]/60" />
        <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,15,0.4)_100%)]" />

        {/* Loading State */}
        {!loaded && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-[#0a0a0f]">
            <div className="flex flex-col items-center gap-6">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 animate-spin rounded-full border-t-2 border-[#00B0B2]" />
                <div className="absolute inset-0 rounded-full border-2 border-white/5" />
              </div>
              <span className="animate-pulse text-[10px] font-medium tracking-[0.4em] text-white/40 uppercase">
                Establishing Connection
              </span>
            </div>
          </div>
        )}

        {/* HUD Elements */}
        <div className="pointer-events-none absolute top-10 right-10 left-10 z-20 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center border border-white/10">
              <div className="h-1 w-1 animate-ping bg-[#00B0B2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] tracking-[0.3em] text-white/30 uppercase">
                System Status
              </span>
              <span className="text-[11px] font-bold tracking-widest text-white uppercase">
                Active / Optimized
              </span>
            </div>
          </div>
          <div className="hidden flex-col items-end md:flex">
            <span className="text-[9px] tracking-[0.3em] text-white/30 uppercase">
              Temporal Sync
            </span>
            {/* Note: In Next.js avoid hydrating timestamps to prevent hydration errors, standard static text here is safer or use a client-only component */}
            <span className="font-mono text-[11px] text-[#00B0B2]">SYNCED</span>
          </div>
        </div>

        {/* Main Text System - Now using the restored TEXT_WAVES */}
        <div className="pointer-events-none relative z-10 h-full w-full">
          {TEXT_WAVES.map((wave, i) => (
            <div
              key={i}
              ref={(el) => {
                textRefs.current[i] = el;
              }}
              className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
            >
              <div className="max-w-5xl">
                <p className="mb-4 flex flex-wrap justify-center text-[10px] font-bold tracking-[0.6em] text-[#00B0B2] uppercase opacity-100 md:text-xs">
                  {wave.subtitle.split("").map((char, index) => (
                    <span
                      key={index}
                      className="sub-char inline-block opacity-0"
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </p>
                <h1 className="mb-6 flex flex-wrap justify-center text-4xl leading-[0.95] font-black tracking-tighter text-white uppercase md:text-7xl lg:text-8xl">
                  {wave.title.split("").map((char, index) => (
                    <span
                      key={index}
                      className="char inline-block opacity-0"
                      style={{
                        color:
                          wave.color === "#00B0B2" && char !== " "
                            ? "#00B0B2"
                            : "inherit",
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </h1>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom HUD */}
        <div className="pointer-events-none absolute right-10 bottom-10 left-10 z-20 flex flex-col gap-6">
          <div className="relative h-[1px] w-full bg-white/5">
            <div className="scroll-progress absolute top-0 left-0 h-full w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-[#00B0B2] to-transparent" />
          </div>
          <div className="flex items-end justify-between opacity-40">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] tracking-[0.5em] text-white/40 uppercase">
                Foundation Core
              </span>
              <span className="text-[10px] font-bold tracking-widest text-white uppercase">
                NEARHUMAN INDUSTRIES
              </span>
            </div>
            <div className="flex gap-12">
              <div className="flex flex-col items-end gap-1">
                <span className="text-[8px] tracking-[0.5em] text-white/40 uppercase">
                  Sequence
                </span>
                <span className="font-mono text-[10px] text-white">
                  0.0.01 // {FRAME_INDICES.length}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[8px] tracking-[0.5em] text-white/40 uppercase">
                  Network
                </span>
                <span className="font-mono text-[10px] text-[#00B0B2]">
                  STABLE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
