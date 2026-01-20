// components/loader/RouteLoader.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function RouteLoader({ onComplete }: { onComplete: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const horizontalLineRef = useRef<HTMLDivElement>(null);
  const verticalLineRef = useRef<HTMLDivElement>(null);
  const centerDotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const curtainTopRef = useRef<HTMLDivElement>(null);
  const curtainBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    document.body.style.pointerEvents = "none";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          document.body.style.pointerEvents = "auto";
          window.scrollTo(0, 0);

          setTimeout(() => {
            if (loaderRef.current) {
              loaderRef.current.style.display = "none";
            }
            onComplete();
          }, 50);
        },
      });

      // Stage 1: Center dot appears (0 - 0.2s)
      tl.fromTo(
        centerDotRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(1.5)" },
        0
      )

        // Stage 2: Ring expands (0.1 - 0.4s)
        .fromTo(
          ringRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" },
          0.1
        )

        // Stage 3: Horizontal line shoots out (0.15 - 0.5s)
        .fromTo(
          horizontalLineRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.4, ease: "power3.out" },
          0.15
        )

        // Stage 4: Vertical line shoots out (0.2 - 0.5s)
        .fromTo(
          verticalLineRef.current,
          { scaleY: 0, opacity: 0 },
          { scaleY: 1, opacity: 1, duration: 0.35, ease: "power3.out" },
          0.2
        )

        // Stage 5: Ring pulses (0.5 - 0.7s)
        .to(
          ringRef.current,
          { scale: 1.3, opacity: 0.5, duration: 0.25, ease: "power2.out" },
          0.5
        )

        // Stage 6: All center elements fade out (0.7 - 0.95s)
        .to(
          [
            centerDotRef.current,
            ringRef.current,
            horizontalLineRef.current,
            verticalLineRef.current,
          ],
          { opacity: 0, scale: 0.9, duration: 0.25, ease: "power2.in" },
          0.7
        )

        // Stage 7: Curtains split open horizontally (0.85 - 1.4s)
        .to(
          curtainTopRef.current,
          { y: "-100%", duration: 0.55, ease: "expo.inOut" },
          0.85
        )
        .to(
          curtainBottomRef.current,
          { y: "100%", duration: 0.55, ease: "expo.inOut" },
          0.85
        )

        // Stage 8: Loader fades out (1.3 - 1.5s)
        .to(
          loaderRef.current,
          { opacity: 0, duration: 0.2, ease: "power1.in" },
          1.3
        );
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "auto";
    };
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-white"
      style={{ willChange: "opacity", isolation: "isolate" }}
    >
      {/* Top Curtain */}
      <div
        ref={curtainTopRef}
        className="absolute left-0 top-0 w-full h-1/2 bg-white z-30"
        style={{ boxShadow: "0 10px 60px rgba(0, 176, 178, 0.15)" }}
      />

      {/* Bottom Curtain */}
      <div
        ref={curtainBottomRef}
        className="absolute left-0 bottom-0 w-full h-1/2 bg-white z-30"
        style={{ boxShadow: "0 -10px 60px rgba(0, 176, 178, 0.15)" }}
      />

      {/* Center Elements */}
      <div className="relative z-20 flex items-center justify-center">
        {/* Ring */}
        <div
          ref={ringRef}
          className="absolute"
          style={{
            width: "100px",
            height: "100px",
            border: "3px solid #00B0B2",
            borderRadius: "50%",
            boxShadow: "0 0 40px rgba(0, 176, 178, 0.4), inset 0 0 20px rgba(0, 176, 178, 0.1)",
            opacity: 0,
          }}
        />

        {/* Center Dot */}
        <div
          ref={centerDotRef}
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: "#00B0B2",
            borderRadius: "50%",
            boxShadow: "0 0 40px rgba(0, 176, 178, 0.8), 0 0 80px rgba(0, 176, 178, 0.4)",
            opacity: 0,
          }}
        />
      </div>

      {/* Horizontal Line - Bold */}
      <div
        ref={horizontalLineRef}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
        style={{
          width: "100%",
          height: "3px",
          background: "linear-gradient(90deg, transparent 0%, #00B0B2 20%, #00B0B2 80%, transparent 100%)",
          boxShadow: "0 0 30px rgba(0, 176, 178, 0.8), 0 0 60px rgba(0, 176, 178, 0.4)",
          transformOrigin: "center",
          opacity: 0,
        }}
      />

      {/* Vertical Line - Bold */}
      <div
        ref={verticalLineRef}
        className="absolute left-1/2 top-0 -translate-x-1/2 z-10"
        style={{
          width: "3px",
          height: "100%",
          background: "linear-gradient(180deg, transparent 0%, #00B0B2 20%, #00B0B2 80%, transparent 100%)",
          boxShadow: "0 0 30px rgba(0, 176, 178, 0.8), 0 0 60px rgba(0, 176, 178, 0.4)",
          transformOrigin: "center",
          opacity: 0,
        }}
      />

      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #00B0B2 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}