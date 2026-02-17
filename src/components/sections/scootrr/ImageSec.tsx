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
  const [showPlayButton, setShowPlayButton] = useState(false);
  const ctxRef = useRef<gsap.Context | null>(null);

  const getIsMobile = useCallback(() => {
    if (typeof window === "undefined") return false;
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !videoContainerRef.current || !maskRef.current)
      return;

    // Clean up previous
    if (ctxRef.current) {
      ctxRef.current.revert();
      ctxRef.current = null;
    }

    const isMobile = getIsMobile();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Calculate the scale factor from initial size to full screen
    // Initial mask is a percentage of viewport, then scales to full viewport
    const initialWidthRatio = isMobile ? 0.7 : 0.5;
    const initialHeightRatio = isMobile ? 0.7 : 0.7;

    // The mask starts at this scale and goes to 1
    const initialScaleX = initialWidthRatio;
    const initialScaleY = initialHeightRatio;
    // Use the smaller scale so the mask fits within both dimensions initially
    const initialScale = Math.min(initialScaleX, initialScaleY);

    // Calculate initial border radius - scaled up because the element is scaled down
    // When element is at scale 0.7, a visual 32px radius needs to be 32/0.7 ≈ 46px
    const initialBorderRadius = Math.round(32 / initialScale);

    const scrubValue = isMobile ? 0.3 : 1.5;

    const ctx = gsap.context(() => {
      // CRITICAL FIX: Set mask to FULL SCREEN size, use scale to make it small
      // This way we never animate width/height (which causes layout recalc)
      // We only animate scale + border-radius (compositor-only, no layout shift)
      gsap.set(maskRef.current, {
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

      gsap.set(videoContainerRef.current, {
        scale: 1,
      });

      // SINGLE ScrollTrigger — one pin, one timeline, no conflicts
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: isMobile ? "+=80%" : "+=120%",
          scrub: scrubValue,
          pin: true,
          pinSpacing: true,
          // CRITICAL: anticipatePin 0 on mobile prevents height miscalc
          anticipatePin: isMobile ? 0 : 1,
          invalidateOnRefresh: true,
          id: "imagesec-pin",
          // CRITICAL: onRefresh recalculates pixel values if viewport changes
          onRefresh: (self) => {
            const newVw = window.innerWidth;
            const newVh = window.innerHeight;
            const newScale = Math.min(
              isMobile ? 0.7 : 0.5,
              isMobile ? 0.7 : 0.7
            );
            const newRadius = Math.round(32 / newScale);

            if (maskRef.current) {
              // Update the full-size dimensions
              gsap.set(maskRef.current, {
                width: newVw,
                height: newVh,
              });
            }
          },
        },
      });

      // MASK: animate scale from initial ratio to 1 (full screen)
      // This is a compositor-only property — NO layout recalculation
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

      // VIDEO CONTAINER: keep scale animation if needed
      tl.to(
        videoContainerRef.current,
        {
          scale: 1,
          ease: "none",
          duration: 1,
        },
        0
      );

      // VIDEO PLAY/PAUSE — separate trigger, no pin
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom top",
        id: "imagesec-video",
        onEnter: () => {
          if (iframeRef.current) {
            if (isMobile) {
              setShowPlayButton(true);
            } else {
              iframeRef.current.contentWindow?.postMessage(
                '{"event":"command","func":"playVideo","args":""}',
                "*"
              );
            }
          }
        },
        onLeave: () => {
          setShowPlayButton(false);
          if (iframeRef.current) {
            iframeRef.current.contentWindow?.postMessage(
              '{"event":"command","func":"pauseVideo","args":""}',
              "*"
            );
          }
        },
        onEnterBack: () => {
          if (iframeRef.current) {
            if (isMobile) {
              setShowPlayButton(true);
            } else {
              iframeRef.current.contentWindow?.postMessage(
                '{"event":"command","func":"playVideo","args":""}',
                "*"
              );
            }
          }
        },
        onLeaveBack: () => {
          setShowPlayButton(false);
          if (iframeRef.current) {
            iframeRef.current.contentWindow?.postMessage(
              '{"event":"command","func":"pauseVideo","args":""}',
              "*"
            );
          }
        },
      });
    }, sectionRef);

    ctxRef.current = ctx;

    return () => {
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, [getIsMobile]);

  // Handle resize — revert and let useEffect re-create
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (ctxRef.current) {
          ctxRef.current.revert();
          ctxRef.current = null;
        }
        // Force re-run
        ScrollTrigger.refresh(true);
      }, 250);
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

  const handlePlayClick = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        "*"
      );
      setShowPlayButton(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      // CRITICAL: Use fixed height, not h-[100vh] class
      // CSS vh on mobile changes when address bar shows/hides
      // Fixed pixel height prevents ScrollTrigger recalculation
      style={{ height: "100svh" }}
    >
      <div
        className="flex items-center justify-center"
        style={{ height: "100svh" }}
      >
        <div
          ref={videoContainerRef}
          className="relative overflow-hidden"
          // CRITICAL: Use svh units to match the section height exactly
          // This prevents the mismatch between section height and content height
          style={{
            width: "100vw",
            height: "100svh",
          }}
        >
          <iframe
            ref={iframeRef}
            className="absolute inset-0 h-full w-full object-cover"
            src="https://www.youtube.com/embed/6-AjSG7Zw_4?enablejsapi=1&mute=1&controls=0&rel=0&playsinline=1"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{
              pointerEvents: showPlayButton ? "auto" : "none",
              touchAction: "none",
            }}
          />

          {showPlayButton && (
            <button
              onClick={handlePlayClick}
              className="absolute top-1/2 left-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-110 active:scale-95"
              aria-label="Play video"
              style={{ pointerEvents: "auto" }}
            >
              <svg
                className="ml-1 h-8 w-8 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          )}

          {/* CRITICAL FIX: Mask is now full-screen sized, scaled down initially
              - No width/height animation (causes layout recalc on mobile)
              - Only scale + borderRadius animation (compositor-only)
              - box-shadow creates the white overlay effect
              - transform-origin center for symmetrical scaling */}
          <div
            ref={maskRef}
            className="overflow-hidden"
            style={{
              // These are set by GSAP in useEffect, but provide fallback
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 0 200vmax white",
              pointerEvents: "none",
              transformOrigin: "center center",
            }}
          />
        </div>
      </div>
    </section>
  );
}
