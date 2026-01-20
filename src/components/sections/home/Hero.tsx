"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register plugin once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const THEME_COLORS = {
  highlight1: "#00B0B2",
  highlight2: "#FF6B9D",
  textPrimary: "#FFFFFF",
};

const TOTAL_FRAMES = 416;
const FRAME_NAMES = Array.from(
  { length: TOTAL_FRAMES },
  (_, i) => `frame_${String(i + 1).padStart(3, "0")}.avif`
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smokeCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  
  // State
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Refs for animation data
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef({ value: 0 }); // Object for GSAP to tween
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // ---------------------------------------------------------------------------
  // 1. PRELOADING LOGIC
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mounted) return;

    let loadedCount = 0;
    const images: HTMLImageElement[] = [];
    imagesRef.current = images;

    const updateProgress = () => {
      loadedCount++;
      const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
      setProgress(pct);
      
      if (loadedCount === TOTAL_FRAMES) {
        setIsLoading(false);
      }
    };

    // Load with concurrency limit to avoid network thrashing
    const loadImages = async () => {
      // Pre-allocate array
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        images[i] = new Image();
      }

      // Batch load
      const BATCH_SIZE = 20;
      for (let i = 0; i < TOTAL_FRAMES; i += BATCH_SIZE) {
        const batch = [];
        const end = Math.min(i + BATCH_SIZE, TOTAL_FRAMES);
        
        for (let j = i; j < end; j++) {
          const promise = new Promise<void>((resolve) => {
            const img = images[j];
            img.onload = () => {
              updateProgress();
              resolve();
            };
            img.onerror = () => {
              // Even if error, resolve to continue
              console.error(`Failed to load frame ${j}`);
              updateProgress();
              resolve();
            };
            img.src = FRAME_PATH(j);
          });
          batch.push(promise);
        }
        await Promise.all(batch);
        // Small delay to yield to main thread
        await new Promise(r => setTimeout(r, 0));
      }
    };

    loadImages();
  }, [mounted]);

  // ---------------------------------------------------------------------------
  // 2. CANVAS RENDERING && SCROLL TRIGGER (useGSAP)
  // ---------------------------------------------------------------------------
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false, desynchronized: true });
    
    if (!canvas || !ctx || isLoading) return;

    const frameIndex = Math.floor(frameIndexRef.current.value);
    const img = imagesRef.current[frameIndex];
    
    if (!img || !img.complete) return;

    const rw = canvas.width;
    const rh = canvas.height;
    
    // Calculate aspect ratio (cover)
    const imgRatio = img.width / img.height;
    const canvasRatio = rw / rh;
    
    let drawW, drawH, drawX, drawY;

    if (canvasRatio > imgRatio) {
      drawW = rw;
      drawH = rw / imgRatio;
      drawX = 0;
      drawY = (rh - drawH) / 2;
    } else {
      drawW = rh * imgRatio;
      drawH = rh;
      drawX = (rw - drawW) / 2;
      drawY = 0;
    }

    ctx.clearRect(0, 0, rw, rh);
    ctx.filter = "brightness(1.05) contrast(1.15) saturate(1.1)";
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, [isLoading]);

  // Handle Resize
  const handleResize = useCallback(() => {
    if (canvasRef.current) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasRef.current.width = window.innerWidth * dpr;
      canvasRef.current.height = window.innerHeight * dpr;
      // Trigger a re-render of current frame
      renderFrame();
    }
  }, [renderFrame]);

  useEffect(() => {
    if (!mounted) return;
    window.addEventListener("resize", handleResize);
    handleResize(); // Init
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted, handleResize]);

  // Animation Logic
  useGSAP(() => {
    if (isLoading || !containerRef.current) return;

    // Initial render of frame 0
    renderFrame();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=500%",
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: () => renderFrame(), // Draw continuously on scrub
      },
    });

    // Tween the frame index object
    tl.to(frameIndexRef.current, {
      value: TOTAL_FRAMES - 1,
      ease: "none",
      duration: 1,
      // Using onUpdate in ScrollTrigger instead of here for better perf
    });

    // Text Animations (Existing Logic)
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
  }, [isLoading]); // Re-run when loading finishes

  // ---------------------------------------------------------------------------
  // 3. SMOKE EFFECT (Debounced Resize Observer)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mounted || !smokeCanvasRef.current) return;

    const canvas = smokeCanvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Particles State
    const particles: any[] = [];
    const MAX_PARTICLES = 180;
    let frameCount = 0;
    let animationId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Puff Texture
    const puffSize = 200;
    const puffCanvas = document.createElement("canvas");
    puffCanvas.width = puffSize;
    puffCanvas.height = puffSize;
    const pCtx = puffCanvas.getContext("2d");
    if (pCtx) {
      const grad = pCtx.createRadialGradient(puffSize/2, puffSize/2, 0, puffSize/2, puffSize/2, puffSize/2);
      grad.addColorStop(0, "rgba(0, 60, 60, 0.4)"); 
      grad.addColorStop(0.3, "rgba(0, 30, 50, 0.2)"); 
      grad.addColorStop(0.7, "rgba(0, 15, 25, 0.05)"); 
      grad.addColorStop(1, "rgba(0, 0, 0, 0)"); 
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, puffSize, puffSize);
    }

    // Update Loop
    const update = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Spawn
      if (particles.length < MAX_PARTICLES) {
         particles.push({
          x: Math.random() * width,
          y: height + 150,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 2 - 1,
          life: 0,
          maxLife: Math.random() * 250 + 150,
          size: Math.random() * 3 + 2,
          alpha: 0,
          rotation: Math.random() * Math.PI * 2,
        });
      }

      // Update & Draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx + Math.sin(p.y * 0.01 + frameCount * 0.005) * 0.3;
        p.y += p.vy;

        // Fade logic
        if (p.life < 60) p.alpha = (p.life / 60) * 0.8;
        else if (p.life > p.maxLife - 60) p.alpha = ((p.maxLife - p.life) / 60) * 0.8;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.alpha;
        ctx.globalCompositeOperation = "screen";
        const size = puffSize * p.size;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation + frameCount * 0.001);
        ctx.drawImage(puffCanvas, -size / 2, -size / 2, size, size);
        ctx.restore();
      }
      
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      animationId = requestAnimationFrame(update);
    };

    update();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
         if (entry.target === canvas) {
            width = entry.contentRect.width;
            height = entry.contentRect.height;
            canvas.width = width;
            canvas.height = height;
         }
      }
    });

    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [mounted]);

  // ---------------------------------------------------------------------------
  // 4. CURSOR EFFECT (Existing)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    const container = containerRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseEnter = () => {
        if (!cursorRef.current || !cursorDotRef.current) return;
        gsap.to([cursorRef.current, cursorDotRef.current], { scale: 1, opacity: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
         if (!cursorRef.current || !cursorDotRef.current) return;
         gsap.to([cursorRef.current, cursorDotRef.current], { scale: 0, opacity: 0, duration: 0.3 });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    
    let rafId: number;
    const loop = () => {
        // Smooth lerp
        cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
        cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;
        
        if (cursorRef.current) {
            cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px) translate(-50%, -50%)`;
        }
         if (cursorDotRef.current) {
            cursorDotRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px) translate(-50%, -50%)`;
        }
        rafId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [mounted]);


  if (!mounted) return null;

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden bg-black cursor-none">
       {/* LOADING SCREEN */}
       {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
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
                        color: isHighlight ? step.highlightColor : THEME_COLORS.textPrimary,
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
