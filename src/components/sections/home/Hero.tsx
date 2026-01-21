"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const smokeCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Refs for animation data
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // ---------------------------------------------------------------------------
  // 1. VIDEO LOADING
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mounted || !videoRef.current) return;

    const video = videoRef.current;

    const handleLoadedData = () => {
      setIsLoading(false);
      // Ensure video is at start
      video.currentTime = 0;
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);

    // Preload video
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [mounted]);

  // ---------------------------------------------------------------------------
  // 2. VIDEO SCROLL ANIMATION (useGSAP)
  // ---------------------------------------------------------------------------
  useGSAP(() => {
    if (isLoading || !containerRef.current || !videoRef.current) return;

    const video = videoRef.current;
    
    // Make sure video is ready
    if (!video.duration) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=500%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Sync video time to scroll progress with smooth interpolation
          if (video.duration) {
            const targetTime = self.progress * video.duration;
            video.currentTime = targetTime;
          }
        },
      },
    });
  }, [isLoading]);

  // ---------------------------------------------------------------------------
  // 3. SMOKE EFFECT
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mounted || !smokeCanvasRef.current) return;

    const canvas = smokeCanvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

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

    const update = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

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

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx + Math.sin(p.y * 0.01 + frameCount * 0.005) * 0.3;
        p.y += p.vy;

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
  // 4. CURSOR EFFECT
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
            LOADING
          </div>
          <div className="h-1 w-64 overflow-hidden rounded-full bg-gray-800">
            <div 
              className="h-full bg-[#00B0B2] animate-pulse"
              style={{ width: '50%' }}
            />
          </div>
        </div>
      )}

      <div className="sticky top-0 h-screen w-full">
        {/* Video Element */}
        <video
          ref={videoRef}
          className="absolute inset-0 block h-full w-full object-cover"
          style={{ width: '100%', height: '100%' }}
          src="/Videos/optimized.mp4"
          muted
          playsInline
          preload="auto"
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
      </div>
    </section>
  );
}