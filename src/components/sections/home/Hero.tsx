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

// Export loading state for parent components
export const heroLoadingState = {
  isFullyLoaded: false,
  loadedCount: 0,
  totalFrames: TOTAL_FRAMES,
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

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [animationReady, setAnimationReady] = useState(false);

  // Render frame
  const renderFrame = useCallback((frameIndex: number) => {
    const ctx = canvasContextRef.current;
    if (!ctx) return;

    const index = Math.max(0, Math.min(Math.round(frameIndex), TOTAL_FRAMES - 1));
    const img = imagesRef.current[index];

    if (!img || !img.complete || !img.naturalWidth) {
      // Try to find nearest available frame
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

    ctx.clearRect(0, 0, rw, rh);
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

    const firstImg = imagesRef.current[0];
    const ratio =
      firstImg?.naturalWidth && firstImg?.naturalHeight
        ? firstImg.naturalWidth / firstImg.naturalHeight
        : 16 / 9;

    dimensionsRef.current = { rw, rh, ratio };
    renderFrame(frameIndexRef.current);
  }, [renderFrame]);

  // Load ALL images before allowing any interaction
  useEffect(() => {
    let isMounted = true;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let loadedCount = 0;

    // Block scrolling until loaded
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const updateProgress = () => {
      if (!isMounted) return;
      const progress = Math.round((loadedCount / TOTAL_FRAMES) * 100);
      setLoadingProgress(progress);
      heroLoadingState.loadedCount = loadedCount;

      if (loadedCount === TOTAL_FRAMES) {
        imagesRef.current = images;
        heroLoadingState.isFullyLoaded = true;
        setAllImagesLoaded(true);
      }
    };

    const loadImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.decoding = "sync"; // Force synchronous decoding
        img.src = FRAME_PATH(index);

        img.onload = () => {
          images[index] = img;
          imagesRef.current[index] = img;
          loadedCount++;
          updateProgress();
          resolve();
        };

        img.onerror = () => {
          console.warn(`Failed to load frame ${index}`);
          loadedCount++;
          updateProgress();
          resolve();
        };
      });
    };

    // Load frames in priority order
    const loadAllFrames = async () => {
      // First, load frame 0 immediately
      await loadImage(0);

      if (!isMounted) return;

      // Setup canvas with first frame
      if (canvasRef.current) {
        resizeCanvas();
        renderFrame(0);
      }

      // Load remaining frames in parallel batches
      const batchSize = 20;
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
  }, [resizeCanvas, renderFrame]);

  // Setup ScrollTrigger ONLY after ALL images are loaded
  useEffect(() => {
    if (!allImagesLoaded || !containerRef.current || !canvasRef.current) return;

    // Re-enable scrolling
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

    // Kill any existing triggers
    ScrollTrigger.getById("hero-scroll-trigger")?.kill();
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
    }

    // Ensure we're at top
    window.scrollTo(0, 0);

    // Wait for layout to stabilize
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
      setAnimationReady(true);
    }, 200);

    window.addEventListener("resize", resizeCanvas);

    return () => {
      clearTimeout(setupTimer);
      window.removeEventListener("resize", resizeCanvas);
      ScrollTrigger.getById("hero-scroll-trigger")?.kill();
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, [allImagesLoaded, resizeCanvas, renderFrame]);

  // Cursor effect
  useEffect(() => {
    if (!animationReady || !containerRef.current) return;

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
  }, [animationReady]);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-black cursor-none"
    >
      {/* Loading overlay - shows until ALL frames are loaded */}
      {!allImagesLoaded && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
          <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-[#00B0B2] transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="text-white/60 text-sm font-medium">
            Loading {loadingProgress}%
          </p>
        </div>
      )}

      <div className="sticky top-0 h-screen w-full">
        <canvas ref={canvasRef} className="absolute inset-0 bg-black" />

        {/* Vignette */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0.6) 100%)`,
          }}
        />

        {/* Top gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-[20%] z-20 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)" }}
        />

        {/* Bottom gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[20%] z-20 pointer-events-none"
          style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.5) 0%, transparent 100%)" }}
        />

        {/* Cursor ring */}
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

        {/* Cursor dot */}
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

        {/* Text */}
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