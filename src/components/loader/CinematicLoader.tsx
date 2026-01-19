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
  const horizontalLineRef = useRef<HTMLDivElement>(null);
  const verticalLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Force scroll and black background
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.body.style.backgroundColor = '#000000';
    document.documentElement.style.backgroundColor = '#000000';
    
    // Prevent scrolling during load
    document.body.style.overflow = 'hidden';
    document.body.style.pointerEvents = 'none';

    // GSAP Timeline
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          document.body.style.pointerEvents = 'auto';

          // 🔥 RESET BACKGROUNDS
          document.body.style.backgroundColor = '';
          document.documentElement.style.backgroundColor = '';

          window.scrollTo(0, 0);

          setTimeout(() => {
            if (loaderRef.current) {
              loaderRef.current.style.display = 'none';
            }
            onComplete();
          }, 100);
        },

      });

      // Stage 1: Black background (instant)
      tl.set(loaderRef.current, { opacity: 1 })

        // Stage 2: Horizontal line expands from center (0.3-1.3s)
        .fromTo(
          horizontalLineRef.current,
          {
            scaleX: 0,
            opacity: 0,
          },
          {
            scaleX: 1,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
          0.3
        )

        // Stage 3: Vertical line expands from center (0.5-1.3s)
        .fromTo(
          verticalLineRef.current,
          {
            scaleY: 0,
            opacity: 0,
          },
          {
            scaleY: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          0.5
        )

        // Stage 4: Logo appears smoothly - no bounce (1.0-2.2s)
        .fromTo(
          logoRef.current,
          {
            scale: 0.7,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power2.out", // Smooth easing, no bounce
          },
          1.0
        )

        // Stage 5: Glow effect appears smoothly (1.2-2.2s)
        .to(
          glowRef.current,
          {
            scale: 2.5,
            opacity: 0.5,
            duration: 1,
            ease: "sine.out",
          },
          1.2
        )

        // Stage 6: Lines fade out (1.8-2.4s)
        .to(
          [horizontalLineRef.current, verticalLineRef.current],
          {
            opacity: 0,
            duration: 0.6,
            ease: "power2.in",
          },
          1.8
        )

        // Stage 7: Hold logo (2.4-3.2s)
        .to({}, { duration: 0.8 }, 2.4)

        // Stage 8: Logo and glow fade out (3.2-3.8s)
        .to(
          [logoRef.current, glowRef.current],
          {
            opacity: 0,
            scale: 0.95,
            duration: 0.6,
            ease: "power2.inOut",
          },
          3.2
        )

        // Stage 9: Curtain split open (3.6-5.0s)
        .to(
          curtainTopRef.current,
          {
            y: "-100%",
            duration: 1.4,
            ease: "expo.inOut",
          },
          3.6
        )
        
        .to(
          curtainBottomRef.current,
          {
            y: "100%",
            duration: 1.4,
            ease: "expo.inOut",
          },
          3.6
        )

        // Stage 10: Fade out entire loader (4.7-5.2s)
        .to(
          loaderRef.current,
          {
            opacity: 0,
            duration: 0.5,
            ease: "power1.in",
          },
          4.7
        );
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
      document.body.style.pointerEvents = 'auto';
    };
  }, [onComplete]);

  return (
    <div 
      ref={loaderRef} 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black"
      style={{ 
        willChange: 'opacity',
        isolation: 'isolate',
      }}
    >
      {/* Horizontal Line - Expands from center */}
      <div
        ref={horizontalLineRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-5"
        style={{
          width: '100%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, #00B0B2 50%, transparent 100%)',
          boxShadow: '0 0 20px rgba(0, 176, 178, 0.8)',
          opacity: 0,
          transformOrigin: 'center',
        }}
      />

      {/* Vertical Line - Expands from center */}
      <div
        ref={verticalLineRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-5"
        style={{
          width: '1px',
          height: '100%',
          background: 'linear-gradient(180deg, transparent 0%, #00B0B2 50%, transparent 100%)',
          boxShadow: '0 0 20px rgba(0, 176, 178, 0.8)',
          opacity: 0,
          transformOrigin: 'center',
        }}
      />

      {/* Logo with Glow */}
      <div className="relative z-20">
        <div
          ref={glowRef}
          className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00B0B2] opacity-0 blur-[120px]"
        />
        
        <div ref={logoRef} className="relative opacity-0">
          <Image
            src="/img/white-logo.png"
            alt="near HUMAN"
            width={340}
            height={38}
            className="h-auto w-[240px] sm:w-[300px] md:w-[340px]"
            style={{
              filter: 'drop-shadow(0 6px 24px rgba(0, 176, 178, 0.5)) drop-shadow(0 0 60px rgba(0, 176, 178, 0.6))',
            }}
            priority
          />
        </div>
      </div>

      {/* Top Curtain */}
      <div
        ref={curtainTopRef}
        className="absolute left-0 top-0 h-1/2 w-full bg-black z-10"
        style={{
          boxShadow: "0 15px 60px rgba(0, 176, 178, 0.2)",
        }}
      />

      {/* Bottom Curtain */}
      <div
        ref={curtainBottomRef}
        className="absolute left-0 bottom-0 h-1/2 w-full bg-black z-10"
        style={{
          boxShadow: "0 -15px 60px rgba(0, 176, 178, 0.2)",
        }}
      />
    </div>
  );
}