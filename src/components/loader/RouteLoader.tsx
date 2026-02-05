// components/loader/RouteLoader.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export default function RouteLoader({
  onComplete,
}: {
  onComplete: () => void;
}) {
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

      // Stage 1: All center elements fade out (0.7 - 0.95s)
      tl.to(
        [
          centerDotRef.current,
          ringRef.current,
          horizontalLineRef.current,
          verticalLineRef.current,
        ],
        { opacity: 0, scale: 0.9, duration: 0.25, ease: "power2.in" },
        0.2
      )

        // Stage 2: Curtains split open horizontally (0.85 - 1.4s)
        .to(
          curtainTopRef.current,
          { y: "-20%", duration: 0.55, ease: "expo.inOut" },
          0.5
        )
        .to(
          curtainBottomRef.current,
          { y: "20%", duration: 0.55, ease: "expo.inOut" },
          0.5
        )

        .to(
          curtainTopRef.current,
          { y: "-100%", duration: 0.55, ease: "expo.inOut" },
          1.2
        )
        .to(
          curtainBottomRef.current,
          { y: "100%", duration: 0.55, ease: "expo.inOut" },
          1.2
        )

        // Stage 3: Loader fades out (1.3 - 1.5s)
        .to(
          loaderRef.current,
          { opacity: 0, duration: 0.2, ease: "power1.in" },
          1.5
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
        className="absolute top-0 left-0 z-30 h-1/2 w-full bg-[#efefef]"
        style={{ boxShadow: "0 10px 60px rgba(0, 176, 178, 0.15)" }}
      >
        <svg
          className="absolute top-full right-0 left-0 w-full"
          width="1920"
          height="66"
          viewBox="0 0 1920 66"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-2.58316e-06 29.5477L257.759 29.5477L293.881 30.2528C303.777 30.446 313.438 33.3057 321.844 38.5311L351.165 56.7587C359.881 62.1766 369.939 65.0477 380.201 65.0477L1540.66 65.0478C1550.9 65.0478 1560.93 62.1915 1569.63 56.8008L1599.27 38.4375C1607.6 33.2716 1617.17 30.4293 1626.98 30.2051L1655.72 29.5478L1920 29.5479L1920 0L0 -0.000167852L-2.58316e-06 29.5477Z"
            fill="#efefef"
            fill-opacity="1"
          />
        </svg>
      </div>

      {/* Bottom Curtain */}
      <div
        ref={curtainBottomRef}
        className="absolute bottom-0 left-0 z-30 h-1/2 w-full bg-[#efefef]"
        style={{ boxShadow: "0 -10px 60px rgba(0, 176, 178, 0.15)" }}
      >
        <svg
          className="absolute right-0 bottom-full left-0 w-full"
          width="1920"
          height="66"
          viewBox="0 0 1920 66"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-2.58316e-06 35.5002L257.759 35.5001L293.881 34.7951C303.777 34.6018 313.438 31.7422 321.844 26.5167L351.165 8.2892C359.881 2.8713 369.939 0.000193797 380.201 0.000134613L1540.66 3.31629e-05C1550.9 3.22682e-05 1560.93 2.85632 1569.63 8.2471L1599.27 26.6104C1607.6 31.7763 1617.17 34.6186 1626.98 34.8428L1655.72 35.5L1920 35.5L1920 65.0479L0 65.048L-2.58316e-06 35.5002Z"
            fill="#efefef"
            fill-opacity="1"
          />
        </svg>
      </div>

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
            boxShadow:
              "0 0 40px rgba(0, 176, 178, 0.4), inset 0 0 20px rgba(0, 176, 178, 0.1)",
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
            boxShadow:
              "0 0 40px rgba(0, 176, 178, 0.8), 0 0 80px rgba(0, 176, 178, 0.4)",
            opacity: 0,
          }}
        />
      </div>
    </div>
  );
}
