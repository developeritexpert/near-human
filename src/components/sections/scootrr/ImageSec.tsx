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
  const isMobileRef = useRef(false);

  const getIsMobile = useCallback(() => {
    if (typeof window === "undefined") return false;
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }, []);

  useEffect(() => {
    isMobileRef.current = getIsMobile();
  }, [getIsMobile]);

  useEffect(() => {
    if (!sectionRef.current || !videoContainerRef.current || !maskRef.current)
      return;

    if (ctxRef.current) {
      ctxRef.current.revert();
      ctxRef.current = null;
    }

    const isMobile = getIsMobile();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const ctx = gsap.context(() => {
      if (isMobile) {
        // MOBILE: No mask animation at all — just show video full screen
        // This completely eliminates the fluctuation/double-render issue
        gsap.set(maskRef.current, {
          width: vw,
          height: vh,
          borderRadius: "0px",
          xPercent: -50,
          yPercent: -50,
          left: "50%",
          top: "50%",
          position: "absolute",
        });

        // Simple pin only — no animation, no scale, no mask transition
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=50%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 0,
          invalidateOnRefresh: true,
          id: "imagesec-pin",
        });
      } else {
        // DESKTOP: Full mask scale animation
        const initialScale = 0.5;
        const initialBorderRadius = Math.round(32 / initialScale);

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
            id: "imagesec-pin",
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

        tl.to(
          videoContainerRef.current,
          {
            scale: 1,
            ease: "none",
            duration: 1,
          },
          0
        );
      }

      // Video play/pause — works on both mobile and desktop
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

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (ctxRef.current) {
          ctxRef.current.revert();
          ctxRef.current = null;
        }
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
      style={{ height: "100svh" }}
    >
      <div
        className="flex items-center justify-center"
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
            }}
          />
        </div>
      </div>
    </section>
  );
}
