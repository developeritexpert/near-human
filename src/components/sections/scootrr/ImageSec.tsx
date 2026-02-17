"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ImageSec() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [screenDimensions, setScreenDimensions] = useState({
    width: 0,
    height: 0,
  });
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);

    setScreenDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setScreenDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !videoContainerRef.current || !maskRef.current)
      return;

    if (screenDimensions.width === 0 || screenDimensions.height === 0) return;

    if (ctxRef.current) {
      ctxRef.current.revert();
      ctxRef.current = null;
    }

    const initialWidth = isMobile
      ? screenDimensions.width * 0.7
      : screenDimensions.width * 0.5;
    const initialHeight = isMobile
      ? screenDimensions.height * 0.7
      : screenDimensions.height * 0.7;

    const scrubValue = isMobile ? 0.5 : 1.5;

    const ctx = gsap.context(() => {
      // FIX: Combine mask expansion and pin into a SINGLE ScrollTrigger timeline
      // This prevents the duplicate rendering caused by two competing ScrollTriggers
      // with different start/end values on the same element
      const pinTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=120%",
          scrub: scrubValue,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: isMobile,
          id: "imagesec-pin", // Unique ID to prevent conflicts
        },
      });

      // Mask expansion happens within the pinned timeline
      pinTimeline.fromTo(
        maskRef.current,
        {
          width: `${initialWidth}px`,
          height: `${initialHeight}px`,
          borderRadius: "32px",
        },
        {
          width: `${screenDimensions.width}px`,
          height: `${screenDimensions.height}px`,
          borderRadius: "0px",
          ease: "none",
          duration: 1,
        },
        0
      );

      // Video scale happens simultaneously in the same timeline
      pinTimeline.to(
        videoContainerRef.current,
        {
          scale: 1,
          ease: "none",
          duration: 1,
        },
        0
      );

      /* ===============================
         VIDEO PLAY/PAUSE ON ENTER/LEAVE
      =============================== */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 50%",
        end: "bottom -120%",
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
          if (iframeRef.current) {
            setShowPlayButton(false);
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
          if (iframeRef.current) {
            setShowPlayButton(false);
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
  }, [isMobile, screenDimensions]);

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

  const initialWidth = isMobile
    ? screenDimensions.width * 0.7
    : screenDimensions.width * 0.5;
  const initialHeight = isMobile
    ? screenDimensions.height * 0.7
    : screenDimensions.height * 0.5;

  return (
    <section ref={sectionRef} className="relative h-[100vh] bg-white">
      <div className="flex h-screen items-center justify-center">
        <div
          ref={videoContainerRef}
          className="relative h-screen w-screen overflow-hidden"
          style={{
            transform: "scale(1)",
            ...(isMobile ? {} : { willChange: "transform" }),
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
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[32px]"
            style={{
              width: `${initialWidth}px`,
              height: `${initialHeight}px`,
              boxShadow: isMobile
                ? "0 0 0 100vmax white"
                : "0 0 0 200vmax white",
              ...(isMobile
                ? {}
                : { willChange: "width, height, border-radius" }),
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </section>
  );
}
