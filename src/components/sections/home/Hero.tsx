// components/sections/home/Hero.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const THEME_COLORS = {
  highlight1: "#00B0B2",
  highlight2: "#FF6B9D",
  textPrimary: "#FFFFFF",
};

const TOTAL_FRAMES = 207;
const FRAME_PATH = (index: number) =>
  `/hero-banner/frame_${String(index + 1).padStart(3, "0")}.webp`;

const TEXT_STEPS = [
  {
    id: 1,
    text: "",
    highlightIndex: 2,
    highlightColor: THEME_COLORS.highlight1,
  },
];

// Global state to track loading - accessible by LoaderWrapper
export const heroState = {
  isLoaded: false,
  onLoadComplete: null as (() => void) | null,
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const dimensionsRef = useRef({ rw: 0, rh: 0, ratio: 16 / 9 });
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });

  const [imagesReady, setImagesReady] = useState(false);

  // Render frame
  const renderFrame = useCallback((frameIndex: number) => {
    const ctx = canvasContextRef.current;
    if (!ctx) return;

    const index = Math.max(0, Math.min(Math.round(frameIndex), TOTAL_FRAMES - 1));
    const img = imagesRef.current[index];

    if (!img || !img.complete || !img.naturalWidth) {
      for (let offset = 1; offset < 10; offset++) {
        const nearImg = imagesRef.current[index - offset] || imagesRef.current[index + offset];
        if (nearImg?.complete && nearImg?.naturalWidth) {
          renderFrameImage(nearImg);
          return;
        }
      }
      return;
    }

    renderFrameImage(img);
    frameIndexRef.current = index;
  }, []);

  const renderFrameImage = (img: HTMLImageElement) => {
    const ctx = canvasContextRef.current;
    if (!ctx) return;

    const { rw, rh, ratio } = dimensionsRef.current;
    if (rw === 0 || rh === 0) return;

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

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, rw, rh);
    ctx.save();
    ctx.filter = "brightness(1.05) contrast(1.15) saturate(1.1)";
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();
  };

  // Resize canvas
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    canvasContextRef.current = ctx;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rw = window.innerWidth;
    const rh = window.innerHeight;

    canvas.width = rw * dpr;
    canvas.height = rh * dpr;
    canvas.style.width = `${rw}px`;
    canvas.style.height = `${rh}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, rw, rh);

    const firstImg = imagesRef.current[0];
    const ratio = firstImg?.naturalWidth && firstImg?.naturalHeight
      ? firstImg.naturalWidth / firstImg.naturalHeight
      : 16 / 9;

    dimensionsRef.current = { rw, rh, ratio };

    if (imagesRef.current[0]) {
      renderFrame(frameIndexRef.current);
    }
  }, [renderFrame]);

  // Load all images
  useEffect(() => {
    let isMounted = true;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let loadedCount = 0;

    // Setup canvas with black background immediately
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d", { alpha: false });
      if (ctx) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rw = window.innerWidth;
        const rh = window.innerHeight;
        canvasRef.current.width = rw * dpr;
        canvasRef.current.height = rh * dpr;
        canvasRef.current.style.width = `${rw}px`;
        canvasRef.current.style.height = `${rh}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, rw, rh);
        canvasContextRef.current = ctx;
        dimensionsRef.current = { rw, rh, ratio: 16 / 9 };
      }
    }

    const onAllLoaded = () => {
      if (!isMounted) return;
      imagesRef.current = images;
      setImagesReady(true);
      heroState.isLoaded = true;

      // Notify LoaderWrapper that hero is ready
      if (heroState.onLoadComplete) {
        heroState.onLoadComplete();
      }
    };

    const loadImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = FRAME_PATH(index);

        img.onload = () => {
          images[index] = img;
          imagesRef.current[index] = img;
          loadedCount++;

          if (index === 0 && canvasContextRef.current) {
            dimensionsRef.current.ratio = img.naturalWidth / img.naturalHeight;
            renderFrame(0);
          }

          if (loadedCount === TOTAL_FRAMES) {
            onAllLoaded();
          }
          resolve();
        };

        img.onerror = () => {
          loadedCount++;
          if (loadedCount === TOTAL_FRAMES) {
            onAllLoaded();
          }
          resolve();
        };
      });
    };

    const loadAllFrames = async () => {
      // Load first frame first
      await loadImage(0);
      if (!isMounted) return;

      // Load remaining frames in batches
      const batchSize = 25;
      for (let batch = 0; batch < Math.ceil((TOTAL_FRAMES - 1) / batchSize); batch++) {
        if (!isMounted) return;

        const start = batch * batchSize + 1;
        const end = Math.min(start + batchSize, TOTAL_FRAMES);
        const promises: Promise<void>[] = [];

        for (let i = start; i < end; i++) {
          promises.push(loadImage(i));
        }

        await Promise.all(promises);
      }
    };

    loadAllFrames();

    return () => {
      isMounted = false;
    };
  }, [renderFrame]);

  // Setup ScrollTrigger after images loaded
  useEffect(() => {
    if (!imagesReady || !containerRef.current || !canvasRef.current) return;

    ScrollTrigger.getById("hero-scroll-trigger")?.kill();
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
    }

    window.scrollTo(0, 0);

    const setupTimer = setTimeout(() => {
      resizeCanvas();
      renderFrame(0);

      const anim = { frame: 0 };

      gsap.set("[data-hero-step]", { opacity: 0, visibility: "hidden", y: 0 });
      gsap.set("[data-hero-word]", { opacity: 0, y: 30, filter: "blur(10px)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "hero-scroll-trigger",
          trigger: containerRef.current,
          start: "top top",
          end: "+=500%",
          scrub: 0.5,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: () => renderFrame(anim.frame),
        },
      });

      scrollTriggerRef.current = tl.scrollTrigger as ScrollTrigger;

      tl.to(anim, {
        frame: TOTAL_FRAMES - 1,
        ease: "none",
        duration: 1,
        onUpdate: () => renderFrame(anim.frame),
      });

      TEXT_STEPS.forEach((step, i) => {
        const start = i / TEXT_STEPS.length;
        const dur = 1 / TEXT_STEPS.length;

        if (step.text) {
          tl.to(
            `[data-hero-step="${step.id}"]`,
            { opacity: 1, visibility: "visible", duration: 0.01 },
            start
          );

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

          if (i < TEXT_STEPS.length - 1) {
            tl.to(
              `[data-hero-step="${step.id}"]`,
              { opacity: 0, duration: 0.15, ease: "power2.in" },
              start + dur * 0.85
            );
          }
        }
      });

      ScrollTrigger.refresh(true);
    }, 100);

    window.addEventListener("resize", resizeCanvas);

    return () => {
      clearTimeout(setupTimer);
      window.removeEventListener("resize", resizeCanvas);
      ScrollTrigger.getById("hero-scroll-trigger")?.kill();
    };
  }, [imagesReady, resizeCanvas, renderFrame]);

  // Cursor effect
  useEffect(() => {
    if (!imagesReady || !containerRef.current) return;

    const container = containerRef.current;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseEnter = () => {
      gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(cursorDotRef.current, { scale: 1, opacity: 1, duration: 0.2 });
    };

    const handleMouseLeave = () => {
      gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.3 });
      gsap.to(cursorDotRef.current, { scale: 0, opacity: 0, duration: 0.2 });
    };

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

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    updateCursor();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [imagesReady]);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden cursor-none"
      style={{ backgroundColor: "#000000" }}
    >
      <div className="sticky top-0 h-screen w-full" style={{ backgroundColor: "#000000" }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ backgroundColor: "#000000" }}
        />

        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0.6) 100%)`,
          }}
        />

        <div
          className="absolute top-0 left-0 right-0 h-[20%] z-20 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)" }}
        />

        <div
          className="absolute bottom-0 left-0 right-0 h-[20%] z-20 pointer-events-none"
          style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.5) 0%, transparent 100%)" }}
        />

        <div
          ref={cursorRef}
          className="pointer-events-none fixed top-0 left-0 z-[100] opacity-0"
          style={{
            width: "40px",
            height: "40px",
            border: "2px solid #00B0B2",
            borderRadius: "50%",
            boxShadow: "0 0 20px rgba(0,176,178,0.4), inset 0 0 20px rgba(0,176,178,0.2)",
            mixBlendMode: "screen",
            transform: "translate(-50%, -50%) scale(0)",
          }}
        />

        <div
          ref={cursorDotRef}
          className="pointer-events-none fixed top-0 left-0 z-[100] opacity-0"
          style={{
            width: "6px",
            height: "6px",
            backgroundColor: "#00B0B2",
            borderRadius: "50%",
            boxShadow: "0 0 10px #00B0B2",
            transform: "translate(-50%, -50%) scale(0)",
          }}
        />

        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          {TEXT_STEPS.map((step) => (
            <div
              key={step.id}
              data-hero-step={step.id}
              className="absolute flex flex-wrap justify-center gap-x-3 gap-y-2 px-4 max-w-6xl"
              style={{ opacity: 0, visibility: "hidden" }}
            >
              {step.text?.split(" ").map((word, wi) => (
                <span
                  key={wi}
                  data-hero-word={wi}
                  className="inline-block"
                  style={{
                    fontSize: "clamp(2.5rem, 8vw, 6rem)",
                    fontWeight: 700,
                    lineHeight: 1.1,
                    color: wi === step.highlightIndex ? step.highlightColor : THEME_COLORS.textPrimary,
                    textShadow: wi === step.highlightIndex ? `0 0 40px ${step.highlightColor}55` : "0 2px 20px rgba(0,0,0,0.6)",
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}