"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ImageSec() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);

  // YouTube video ID
  const videoId = "6-AjSG7Zw_4";

  useEffect(() => {
    const mobile =
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      window.innerWidth < 768;
    setIsMobile(mobile);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !videoContainerRef.current || !maskRef.current)
      return;

    if (ctxRef.current) {
      ctxRef.current.revert();
      ctxRef.current = null;
    }

    // Wait one frame for layout to settle
    const rafId = requestAnimationFrame(() => {
      if (!sectionRef.current || !videoContainerRef.current || !maskRef.current)
        return;

      const mobile =
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
        window.innerWidth < 768;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const ctx = gsap.context(() => {
        if (mobile) {
          // ========================
          // MOBILE: No mask animation, no iframe on load
          // Just a clean pinned section with thumbnail
          // ========================
          gsap.set(maskRef.current, { display: "none" });

          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "+=10",
            pin: true,
            pinSpacing: true,
            anticipatePin: 0,
            invalidateOnRefresh: true,
            id: "imagesec-pin-mobile",
          });
        } else {
          // ========================
          // DESKTOP: Full mask scale animation with iframe
          // ========================
          const initialScale = 0.5;
          const initialBorderRadius = Math.round(32 / initialScale);

          gsap.set(maskRef.current, {
            display: "block",
            width: vw,
            height: vh,
            scale: initialScale,
            borderRadius: `${initialBorderRadius}px`,
            xPercent: -50,
            yPercent: -50,
            left: "50%",
            top: "50%",
            position: "absolute",
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=120%",
              scrub: 1.5,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              id: "imagesec-pin-desktop",
              onRefresh: () => {
                const newVw = window.innerWidth;
                const newVh = window.innerHeight;
                if (maskRef.current) {
                  gsap.set(maskRef.current, {
                    width: newVw,
                    height: newVh,
                  });
                }
              },
            },
          });

          tl.to(
            maskRef.current,
            {
              scale: 1,
              borderRadius: "0px",
              ease: "none",
              duration: 1,
            },
            0
          );

          // Desktop: auto-play iframe when section enters
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom top",
            id: "imagesec-video-desktop",
            onEnter: () => {
              iframeRef.current?.contentWindow?.postMessage(
                '{"event":"command","func":"playVideo","args":""}',
                "*"
              );
            },
            onLeave: () => {
              iframeRef.current?.contentWindow?.postMessage(
                '{"event":"command","func":"pauseVideo","args":""}',
                "*"
              );
            },
            onEnterBack: () => {
              iframeRef.current?.contentWindow?.postMessage(
                '{"event":"command","func":"playVideo","args":""}',
                "*"
              );
            },
            onLeaveBack: () => {
              iframeRef.current?.contentWindow?.postMessage(
                '{"event":"command","func":"pauseVideo","args":""}',
                "*"
              );
            },
          });
        }
      }, sectionRef);

      ctxRef.current = ctx;
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, [isMobile]);

  // Handle resize
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const mobile =
          /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
          window.innerWidth < 768;
        setIsMobile(mobile);
        ScrollTrigger.refresh(true);
      }, 300);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        ScrollTrigger.refresh(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleMobilePlay = () => {
    setVideoStarted(true);
  };

  const handleCloseVideo = () => {
    setVideoStarted(false);
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      style={{ height: "100svh" }}
    >
      <div
        className="flex items-center justify-center px-[15px] md:px-0"
        style={{ height: "100svh" }}
      >
        <div
          ref={videoContainerRef}
          className="relative overflow-hidden"
          style={{
            width: "100vw",
            height: "100svh",
          }}
        >
          {isMobile ? (
            <>
              {/* MOBILE: Static thumbnail — no iframe until user taps play */}
              {!videoStarted && (
                <div className="absolute inset-0 z-[1]">
                  {/* YouTube max-res thumbnail */}
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt="Video thumbnail"
                    className="h-full w-full object-cover"
                    loading="eager"
                  />

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/30" />

                  {/* Play button */}
                  <button
                    onClick={handleMobilePlay}
                    className="absolute top-1/2 left-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-2xl transition-transform active:scale-90"
                    aria-label="Play video"
                  >
                    <svg
                      className="ml-1.5 h-9 w-9 text-black"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              )}

              {/* MOBILE: Iframe loads ONLY after user taps play */}
              {videoStarted && (
                <div className="absolute inset-0 z-[2]">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0&playsinline=1`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{ border: "none" }}
                  />

                  {/* Close / back to thumbnail button */}
                  <button
                    onClick={handleCloseVideo}
                    className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-transform active:scale-90"
                    aria-label="Close video"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* DESKTOP: Iframe loads immediately with autoplay muted */}
              <iframe
                ref={iframeRef}
                className="absolute inset-0 h-full w-full object-cover"
                src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&mute=1&controls=0&rel=0&playsinline=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{
                  pointerEvents: "none",
                  touchAction: "none",
                }}
              />
            </>
          )}

          {/* Mask — desktop only, hidden on mobile */}
          <div
            ref={maskRef}
            className="overflow-hidden"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 0 200vmax white",
              pointerEvents: "none",
              transformOrigin: "center center",
              display: "none",
            }}
          />
        </div>
      </div>
    </section>
  );
}
