"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugin once at module level
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const THEME_COLORS = {
  highlight1: "#00B0B2",
  highlight2: "#FF6B9D",
  textPrimary: "#FFFFFF",
};

// Particle interface for better type safety
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const smokeCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Refs for animation data - using single object to reduce ref count
  const animationData = useRef({
    mouseX: 0,
    mouseY: 0,
    cursorX: 0,
    cursorY: 0,
    isHovering: false,
    lastFrameTime: 0,
    scrollTrigger: null as ScrollTrigger | null,
  });

  // Particle pool for object reuse
  const particlePool = useRef<Particle[]>([]);
  const activeParticles = useRef<Particle[]>([]);

  useEffect(() => {
    setMounted(true);
    return () => {
      // Cleanup ScrollTrigger on unmount
      if (animationData.current.scrollTrigger) {
        animationData.current.scrollTrigger.kill();
      }
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 1. VIDEO LOADING - Optimized with single event listener approach
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mounted || !videoRef.current) return;

    const video = videoRef.current;
    let timeoutId: NodeJS.Timeout;

    const handleCanPlay = () => {
      video.currentTime = 0;
      setIsLoading(false);
      
      // Delayed refresh for better accuracy
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };

    // Check if already loaded
    if (video.readyState >= 3) {
      handleCanPlay();
      return;
    }

    video.addEventListener("canplaythrough", handleCanPlay, { once: true });
    video.load();

    // Timeout safety (4s)
    timeoutId = setTimeout(() => {
      console.warn("Video load timeout - forcing visibility");
      setIsLoading(false);
    }, 4000);

    return () => {
      video.removeEventListener("canplaythrough", handleCanPlay);
      clearTimeout(timeoutId);
    };
  }, [mounted]);

  // ---------------------------------------------------------------------------
  // 2. VIDEO SCROLL ANIMATION - Optimized with direct manipulation
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (isLoading || !containerRef.current || !videoRef.current) return;

    const video = videoRef.current;

    // Wait for valid duration
    const initScrollTrigger = () => {
      if (!video.duration || isNaN(video.duration)) {
        requestAnimationFrame(initScrollTrigger);
        return;
      }

      const duration = video.duration;
      let lastTime = 0;

      animationData.current.scrollTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=500%",
        scrub: 0.1, // Slight smoothing for better feel
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const targetTime = self.progress * duration;
          
          // Only update if change is significant (reduces repaints)
          if (Math.abs(targetTime - lastTime) > 0.016) {
            video.currentTime = targetTime;
            lastTime = targetTime;
          }
        },
      });

      video.currentTime = 0;
    };

    initScrollTrigger();

    return () => {
      if (animationData.current.scrollTrigger) {
        animationData.current.scrollTrigger.kill();
        animationData.current.scrollTrigger = null;
      }
    };
  }, [isLoading]);

  // ---------------------------------------------------------------------------
  // 3. SMOKE EFFECT - Heavily optimized with object pooling
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mounted || !smokeCanvasRef.current) return;

    const canvas = smokeCanvasRef.current;
    const ctx = canvas.getContext("2d", { 
      alpha: true,
      desynchronized: true // Better performance on supported browsers
    });
    if (!ctx) return;

    const MAX_PARTICLES = 120; // Reduced for better performance
    const SPAWN_RATE = 2; // Particles per frame
    let animationId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let frameCount = 0;

    // Set canvas size
    const updateCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2); // Cap at 2x for performance
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    updateCanvasSize();

    // Pre-rendered puff texture (smaller for performance)
    const puffSize = 128;
    const puffCanvas = document.createElement("canvas");
    puffCanvas.width = puffSize;
    puffCanvas.height = puffSize;
    const pCtx = puffCanvas.getContext("2d");
    
    if (pCtx) {
      const center = puffSize / 2;
      const grad = pCtx.createRadialGradient(center, center, 0, center, center, center);
      grad.addColorStop(0, "rgba(0, 80, 80, 0.5)");
      grad.addColorStop(0.25, "rgba(0, 50, 60, 0.3)");
      grad.addColorStop(0.5, "rgba(0, 30, 40, 0.15)");
      grad.addColorStop(0.75, "rgba(0, 15, 25, 0.05)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, puffSize, puffSize);
    }

    // Get particle from pool or create new one
    const getParticle = (): Particle => {
      if (particlePool.current.length > 0) {
        return particlePool.current.pop()!;
      }
      return {
        x: 0, y: 0, vx: 0, vy: 0,
        life: 0, maxLife: 0, size: 0,
        alpha: 0, rotation: 0, rotationSpeed: 0
      };
    };

    // Return particle to pool
    const returnParticle = (p: Particle) => {
      if (particlePool.current.length < MAX_PARTICLES * 2) {
        particlePool.current.push(p);
      }
    };

    // Spawn new particle
    const spawnParticle = () => {
      const p = getParticle();
      p.x = Math.random() * width;
      p.y = height + 100;
      p.vx = (Math.random() - 0.5) * 1.2;
      p.vy = -(Math.random() * 1.5 + 0.8);
      p.life = 0;
      p.maxLife = Math.random() * 200 + 120;
      p.size = Math.random() * 2.5 + 1.5;
      p.alpha = 0;
      p.rotation = Math.random() * Math.PI * 2;
      p.rotationSpeed = (Math.random() - 0.5) * 0.02;
      activeParticles.current.push(p);
    };

    const update = (timestamp: number) => {
      // Throttle to ~30fps for smoke (sufficient for visual effect)
      const delta = timestamp - animationData.current.lastFrameTime;
      if (delta < 33) {
        animationId = requestAnimationFrame(update);
        return;
      }
      animationData.current.lastFrameTime = timestamp;
      
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Spawn particles
      if (activeParticles.current.length < MAX_PARTICLES) {
        for (let i = 0; i < SPAWN_RATE && activeParticles.current.length < MAX_PARTICLES; i++) {
          spawnParticle();
        }
      }

      // Set composite mode once
      ctx.globalCompositeOperation = "screen";

      const particles = activeParticles.current;
      const sinTable = Math.sin(frameCount * 0.008); // Pre-calculate

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        // Update position with simplified wave
        p.x += p.vx + sinTable * 0.4;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Calculate alpha (fade in/out)
        const fadeIn = 50;
        const fadeOut = 50;
        if (p.life < fadeIn) {
          p.alpha = (p.life / fadeIn) * 0.6;
        } else if (p.life > p.maxLife - fadeOut) {
          p.alpha = ((p.maxLife - p.life) / fadeOut) * 0.6;
        } else {
          p.alpha = 0.6;
        }

        // Remove dead particles
        if (p.life >= p.maxLife || p.y < -200) {
          particles.splice(i, 1);
          returnParticle(p);
          continue;
        }

        // Draw particle
        ctx.globalAlpha = p.alpha;
        const size = puffSize * p.size;
        const halfSize = size / 2;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.drawImage(puffCanvas, -halfSize, -halfSize, size, size);
        ctx.restore();
      }

      // Reset
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      animationId = requestAnimationFrame(update);
    };

    animationId = requestAnimationFrame(update);

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateCanvasSize, 150);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
      activeParticles.current = [];
    };
  }, [mounted]);

  // ---------------------------------------------------------------------------
  // 4. CURSOR EFFECT - Optimized with RAF batching
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const container = containerRef.current;
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    
    if (!cursor || !cursorDot) return;

    let rafId: number;
    const data = animationData.current;

    // Use passive event listeners for better scroll performance
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      data.mouseX = e.clientX - rect.left;
      data.mouseY = e.clientY - rect.top;
    };

    const handleMouseEnter = () => {
      data.isHovering = true;
      cursor.style.opacity = "1";
      cursor.style.transform = `translate(${data.cursorX}px, ${data.cursorY}px) translate(-50%, -50%) scale(1)`;
      cursorDot.style.opacity = "1";
    };

    const handleMouseLeave = () => {
      data.isHovering = false;
      cursor.style.opacity = "0";
      cursor.style.transform = `translate(${data.cursorX}px, ${data.cursorY}px) translate(-50%, -50%) scale(0)`;
      cursorDot.style.opacity = "0";
    };

    // Optimized animation loop using CSS transforms
    const loop = () => {
      // Smooth interpolation
      const ease = 0.12;
      data.cursorX += (data.mouseX - data.cursorX) * ease;
      data.cursorY += (data.mouseY - data.cursorY) * ease;

      // Use transform3d for GPU acceleration
      cursor.style.transform = `translate3d(${data.cursorX}px, ${data.cursorY}px, 0) translate(-50%, -50%)`;
      cursorDot.style.transform = `translate3d(${data.mouseX}px, ${data.mouseY}px, 0) translate(-50%, -50%)`;

      rafId = requestAnimationFrame(loop);
    };

    // Initialize cursor position
    data.cursorX = window.innerWidth / 2;
    data.cursorY = window.innerHeight / 2;

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    rafId = requestAnimationFrame(loop);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-black cursor-none"
    >
      {/* LOADING SCREEN */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
          <div className="mb-4 text-2xl font-bold tracking-widest text-[#00B0B2]">
            LOADING
          </div>
          <div className="h-1 w-64 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full bg-[#00B0B2] animate-pulse"
              style={{ width: "50%" }}
            />
          </div>
        </div>
      )}

      <div className="sticky top-0 h-screen w-full">
        {/* Video Element - Optimized attributes */}
        <video
          ref={videoRef}
          className="absolute inset-0 block h-full w-full object-cover"
          src="/Videos/optimized.mp4"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
        />

        {/* Smoke Canvas */}
        <canvas
          ref={smokeCanvasRef}
          className="absolute inset-0 z-10 pointer-events-none mix-blend-screen"
          style={{ willChange: "transform" }}
        />

        {/* Overlays - Using CSS custom properties for potential theming */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0.6) 100%)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-[20%] z-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[20%] z-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.5) 0%, transparent 100%)",
          }}
        />

        {/* Custom Cursor - GPU accelerated */}
        <div
          ref={cursorRef}
          className="pointer-events-none fixed top-0 left-0 z-[100] h-10 w-10 rounded-full border-2 border-[#00B0B2] opacity-0 mix-blend-screen"
          style={{
            willChange: "transform, opacity",
            boxShadow:
              "0 0 20px rgba(0,176,178,0.4), inset 0 0 20px rgba(0,176,178,0.2)",
            backfaceVisibility: "hidden",
          }}
        />
        <div
          ref={cursorDotRef}
          className="pointer-events-none fixed top-0 left-0 z-[100] h-1.5 w-1.5 rounded-full bg-[#00B0B2] opacity-0"
          style={{
            willChange: "transform, opacity",
            boxShadow: "0 0 10px #00B0B2",
            backfaceVisibility: "hidden",
          }}
        />
      </div>
    </section>
  );
}