"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const THEME_COLORS = {
  highlight1: "#00B0B2",
  highlight2: "#FF6B9D",
  textPrimary: "#FFFFFF",
};

// Generate frame names: frame_001.webp to frame_207.webp
const TOTAL_FRAMES = 207;
const FRAME_NAMES = Array.from(
  { length: TOTAL_FRAMES }, 
  (_, i) => `frame_${String(i + 1).padStart(3, '0')}.webp`
);

const FRAME_PATH = (index: number) => `/hero-banner/${FRAME_NAMES[index]}`;

const TEXT_STEPS = [
  {
    id: 1,
    text: "",
    highlightIndex: 2,
    highlightColor: THEME_COLORS.highlight1,
  },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const frameIndexRef = useRef(0);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const resizeHandlerRef = useRef<(() => void) | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let loadedCount = 0;
    const totalFrames = TOTAL_FRAMES;

    const firstImg = new Image();
    firstImg.src = FRAME_PATH(0);
    firstImg.onload = () => {
      imagesRef.current[0] = firstImg;
      setFirstFrameReady(true);
      loadedCount++;
      loadRemainingFrames();
    };
    firstImg.onerror = () => {
      console.error('Failed to load first frame');
      setFirstFrameReady(true);
    };

    const loadRemainingFrames = () => {
      const batchSize = 10;
      let currentBatch = 0;

      const loadBatch = () => {
        const start = currentBatch * batchSize + 1;
        const end = Math.min(start + batchSize, totalFrames);

        for (let i = start; i < end; i++) {
          const img = new Image();
          img.src = FRAME_PATH(i);
          img.onload = () => {
            imagesRef.current[i] = img;
            loadedCount++;
            if (loadedCount === totalFrames) setLoaded(true);
          };
          img.onerror = () => {
            console.error(`Failed to load frame ${i}`);
            loadedCount++;
            if (loadedCount === totalFrames) setLoaded(true);
          };
        }

        currentBatch++;
        if (end < totalFrames) {
          setTimeout(loadBatch, 50);
        }
      };

      loadBatch();
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const container = containerRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseEnter = () => {
      if (cursorRef.current && cursorDotRef.current) {
        gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3 });
        gsap.to(cursorDotRef.current, { scale: 1, opacity: 1, duration: 0.2 });
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current && cursorDotRef.current) {
        gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.3 });
        gsap.to(cursorDotRef.current, { scale: 0, opacity: 0, duration: 0.2 });
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    let rafId: number;
    const updateCursor = () => {
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px) translate(-50%, -50%)`;
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(updateCursor);
    };

    updateCursor();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !canvasRef.current || !firstFrameReady) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { 
      alpha: false,
      desynchronized: true,
      willReadFrequently: false,
    });
    if (!ctx) return;

    let rw = 0;
    let rh = 0;
    let ratio = 1;

    const renderFrame = (i: number) => {
      const index = Math.max(0, Math.min(Math.round(i), TOTAL_FRAMES - 1));
      const img = imagesRef.current[index];
      if (!img || !img.complete) return;

      const cr = rw / rh;
      let dw = rw, dh = rh, dx = 0, dy = 0;

      if (ratio > cr) {
        dh = rh;
        dw = dh * ratio;
        dx = (rw - dw) / 2;
      } else {
        dw = rw;
        dh = dw / ratio;
        dy = (rh - dh) / 2;
      }

      ctx.clearRect(0, 0, rw, rh);
      ctx.save();
      ctx.filter = "brightness(1.05) contrast(1.15) saturate(1.1)";
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
      
      frameIndexRef.current = index;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      rw = window.innerWidth;
      rh = window.innerHeight;
      canvas.width = rw * dpr;
      canvas.height = rh * dpr;
      canvas.style.width = `${rw}px`;
      canvas.style.height = `${rh}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      const firstImg = imagesRef.current[0];
      ratio = firstImg?.width && firstImg?.height 
        ? firstImg.width / firstImg.height 
        : 16 / 9;
      renderFrame(frameIndexRef.current);
    };

    resize();
    resizeHandlerRef.current = resize;
    window.addEventListener("resize", resize);
    renderFrame(0);

    return () => {
      if (resizeHandlerRef.current) {
        window.removeEventListener("resize", resizeHandlerRef.current);
        resizeHandlerRef.current = null;
      }
    };
  }, [mounted, firstFrameReady]);

  useEffect(() => {
    if (!mounted || !loaded || !containerRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { 
      alpha: false, 
      desynchronized: true,
      willReadFrequently: false,
    });
    if (!ctx) return;

    let rw = window.innerWidth;
    let rh = window.innerHeight;
    let ratio = imagesRef.current[0]?.width && imagesRef.current[0]?.height 
      ? imagesRef.current[0].width / imagesRef.current[0].height 
      : 16 / 9;

    const renderFrame = (i: number) => {
      const index = Math.max(0, Math.min(Math.round(i), TOTAL_FRAMES - 1));
      const img = imagesRef.current[index];
      if (!img || !img.complete) return;

      const cr = rw / rh;
      let dw = rw, dh = rh, dx = 0, dy = 0;

      if (ratio > cr) {
        dh = rh;
        dw = dh * ratio;
        dx = (rw - dw) / 2;
      } else {
        dw = rw;
        dh = dw / ratio;
        dy = (rh - dh) / 2;
      }

      ctx.clearRect(0, 0, rw, rh);
      ctx.save();
      ctx.filter = "brightness(1.05) contrast(1.15) saturate(1.1)";
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 1px)", () => {
      const anim = { frame: 0 };

      gsap.set("[data-step]", { opacity: 0, visibility: "hidden", y: 0 });
      gsap.set("[data-word]", { opacity: 0, y: 30, filter: "blur(10px)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=500%",
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / TEXT_STEPS.length,
            duration: 0.3,
            ease: "power1.inOut",
          },
          onUpdate: () => {
            if (containerRef.current) {
              renderFrame(anim.frame);
            }
          },
        },
      });

      timelineRef.current = tl;

      tl.to(anim, {
        frame: TOTAL_FRAMES - 1,
        ease: "none",
        duration: 1,
        onUpdate: () => {
          if (containerRef.current) {
            renderFrame(anim.frame);
          }
        },
      });

      TEXT_STEPS.forEach((step, i) => {
        const start = i / TEXT_STEPS.length;
        const dur = 1 / TEXT_STEPS.length;

        if (step.text) {
          tl.to(`[data-step="${step.id}"]`, { opacity: 1, visibility: "visible", duration: 0.01 }, start);

          const words = step.text.split(" ");
          const wordDelay = (dur * 0.6) / words.length;

          words.forEach((_, wi) => {
            tl.to(
              `[data-step="${step.id}"] [data-word="${wi}"]`,
              { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.2, ease: "power2.out" },
              start + 0.05 + wi * wordDelay
            );
          });

          if (i < TEXT_STEPS.length - 1) {
            tl.to(`[data-step="${step.id}"]`, { opacity: 0, duration: 0.15, ease: "power2.in" }, start + dur * 0.85);
            tl.set(`[data-step="${step.id}"]`, { visibility: "hidden" }, start + dur * 0.95);
            tl.set(`[data-step="${step.id}"] [data-word]`, { opacity: 0, y: 30, filter: "blur(10px)" }, start + dur * 0.95);
          }
        }
      });

      return () => {};
    });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }

      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === containerRef.current) {
          trigger.kill();
        }
      });

      mm.revert();
    };
  }, [mounted, loaded]);

  if (!mounted) {
    return null;
  }

  return (
    <section 
      ref={containerRef} 
      className="relative w-full overflow-hidden bg-black cursor-none"
      style={{ 
        opacity: firstFrameReady ? 1 : 0,
        transition: "opacity 0.3s ease-in-out"
      }}
    >
      <div className="sticky top-0 h-screen w-full">
        {/* Full Screen Canvas - NO ZOOM */}
        <canvas ref={canvasRef} className="absolute inset-0 bg-black" />

        {/* Subtle Radial Vignette Gradient */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: `
              radial-gradient(
                ellipse at center,
                transparent 50%,
                rgba(0,0,0,0.3) 80%,
                rgba(0,0,0,0.6) 100%
              )
            `,
          }}
        />

        {/* Top Edge Fade */}
        <div 
          className="absolute top-0 left-0 right-0 h-[20%] z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)',
          }}
        />

        {/* Bottom Edge Fade */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[20%] z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(0deg, rgba(0,0,0,0.5) 0%, transparent 100%)',
          }}
        />

        {/* Custom Cursor - Outer Ring */}
        <div
          ref={cursorRef}
          className="pointer-events-none fixed left-0 top-0 z-[100] opacity-0"
          style={{
            width: "40px",
            height: "40px",
            border: "2px solid #00B0B2",
            borderRadius: "50%",
            boxShadow: "0 0 20px rgba(0, 176, 178, 0.4), inset 0 0 20px rgba(0, 176, 178, 0.2)",
            mixBlendMode: "screen",
            transform: "translate(-50%, -50%) scale(0)",
            willChange: "transform",
          }}
        />

        {/* Custom Cursor - Inner Dot */}
        <div
          ref={cursorDotRef}
          className="pointer-events-none fixed left-0 top-0 z-[100] opacity-0"
          style={{
            width: "6px",
            height: "6px",
            backgroundColor: "#00B0B2",
            borderRadius: "50%",
            boxShadow: "0 0 10px #00B0B2",
            transform: "translate(-50%, -50%) scale(0)",
            willChange: "transform",
          }}
        />

        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          {TEXT_STEPS.map((step) => (
            <div
              key={step.id}
              data-step={step.id}
              className="absolute flex flex-wrap justify-center gap-x-3 gap-y-2 px-4 max-w-6xl"
              style={{ opacity: 0, visibility: "hidden" }}
            >
              {step.text && step.text.split(" ").map((word, wi) => {
                const isHighlight = wi === step.highlightIndex;
                return (
                  <span
                    key={wi}
                    data-word={wi}
                    className="inline-block"
                    style={{
                      fontSize: "clamp(2.5rem, 8vw, 6rem)",
                      fontWeight: 700,
                      lineHeight: 1.1,
                      color: isHighlight ? step.highlightColor : THEME_COLORS.textPrimary,
                      textShadow: isHighlight
                        ? `0 0 40px ${step.highlightColor}55`
                        : "0 2px 20px rgba(0,0,0,0.6)",
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