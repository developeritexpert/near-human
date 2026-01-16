"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export default function CinematicLoader({ onComplete }: { onComplete: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const curtainTopRef = useRef<HTMLDivElement>(null);
  const curtainBottomRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Force scroll to top
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Prevent scrolling during load
    document.body.style.overflow = 'hidden';
    document.body.style.pointerEvents = 'none';
    
    // Canvas animation setup
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle class for wire effect
    class Particle {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      speed: number;

      constructor(x: number, y: number, targetX: number, targetY: number) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = 0.015 + Math.random() * 0.02; // Slower speed
      }

      update() {
        this.x += (this.targetX - this.x) * this.speed;
        this.y += (this.targetY - this.y) * this.speed;
      }

      draw(ctx: CanvasRenderingContext2D, opacity: number) {
        ctx.fillStyle = `rgba(0, 176, 178, ${opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create grid of particles
    const particles: Particle[] = [];
    const gridSize = 70; // Slightly larger grid
    const cols = Math.ceil(canvas.width / gridSize);
    const rows = Math.ceil(canvas.height / gridSize);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * gridSize;
        const y = j * gridSize;
        const startX = canvas.width / 2;
        const startY = canvas.height / 2;
        particles.push(new Particle(startX, startY, x, y));
      }
    }

    let animationFrame: number;
    let particleOpacity = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.5
      );
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(1, '#F8FAFA');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw glowing lines (slower animation)
      const time = Date.now() * 0.0005; // Slower time progression
      
      for (let i = 0; i < 6; i++) { // Fewer lines
        const offset = i * 180 + time * 40;
        const opacity = 0.15 + Math.sin(time * 2 + i) * 0.1;
        
        // Diagonal lines
        ctx.strokeStyle = `rgba(0, 176, 178, ${opacity})`;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(0, 176, 178, 0.3)';
        
        ctx.beginPath();
        ctx.moveTo(offset % canvas.width, 0);
        ctx.lineTo((offset + canvas.height) % canvas.width, canvas.height);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;

      // Draw connections between particles
      ctx.strokeStyle = 'rgba(0, 176, 178, 0.1)';
      ctx.lineWidth = 1;

      particles.forEach((particle, i) => {
        particle.update();
        particle.draw(ctx, particleOpacity * 0.7);

        // Connect to nearby particles
        particles.slice(i + 1, i + 4).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < gridSize * 1.8) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      // Slower fade in
      if (particleOpacity < 0.6) {
        particleOpacity += 0.008;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    // GSAP Timeline - Slower and smoother
    const ctx2 = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          document.body.style.pointerEvents = 'auto';
          window.scrollTo(0, 0);
          onComplete();
        },
      });

      tl.set(loaderRef.current, { opacity: 1 })
        
        // Slower logo entrance with smoother easing
        .from(logoRef.current, {
          scale: 0.3,
          opacity: 0,
          duration: 1.4,
          ease: "power2.out", // Smoother than back.out
        }, 1)
        
        // Gradual glow effect
        .to(glowRef.current, {
          scale: 2.2,
          opacity: 0.5,
          duration: 1.2,
          ease: "sine.inOut",
        }, 1.3)
        
        // Longer hold for logo
        .to({}, { duration: 1 }, 2.4)
        
        // Smooth fade out of logo and glow
        .to([logoRef.current, glowRef.current], {
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          ease: "power2.inOut",
        }, 3.4)
        
        // Slower curtain split with smooth easing
        .to(curtainTopRef.current, {
          y: "-100%",
          duration: 1.6,
          ease: "expo.inOut", // Very smooth easing
        }, 4)
        
        .to(curtainBottomRef.current, {
          y: "100%",
          duration: 1.6,
          ease: "expo.inOut",
        }, 4)
        
        // Gentle fade out
        .to(loaderRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power1.in",
        }, 5.2);
    });

    return () => {
      ctx2.revert();
      cancelAnimationFrame(animationFrame);
      document.body.style.overflow = '';
      document.body.style.pointerEvents = 'auto';
    };
  }, [onComplete]);

  return (
    <div ref={loaderRef} className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Canvas Wire Effect */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />

      {/* Logo with Glow */}
      <div className="relative z-20">
        <div
          ref={glowRef}
          className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00B0B2] opacity-0 blur-[120px]"
        />
        
        <div ref={logoRef} className="relative">
          <Image
            src="/img/white-logo.png"
            alt="near HUMAN"
            width={340}
            height={38}
            className="h-auto w-[240px] sm:w-[300px] md:w-[340px]"
            style={{
              filter: 'drop-shadow(0 6px 24px rgba(0, 0, 0, 0.25)) drop-shadow(0 0 50px rgba(0, 176, 178, 0.4))',
            }}
            priority
          />
        </div>
      </div>

      {/* Top Curtain */}
      <div
        ref={curtainTopRef}
        className="absolute left-0 top-0 h-1/2 w-full bg-white z-10"
        style={{
          boxShadow: "0 15px 50px rgba(0, 176, 178, 0.08)",
        }}
      />

      {/* Bottom Curtain */}
      <div
        ref={curtainBottomRef}
        className="absolute left-0 bottom-0 h-1/2 w-full bg-white z-10"
        style={{
          boxShadow: "0 -15px 50px rgba(0, 176, 178, 0.08)",
        }}
      />
    </div>
  );
}