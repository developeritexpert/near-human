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

  useEffect(() => {
    // Detect mobile device
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

    // Get screen dimensions
    setScreenDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Update dimensions on resize
    const handleResize = () => {
      setScreenDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !videoContainerRef.current || !maskRef.current)
      return;

    if (screenDimensions.width === 0 || screenDimensions.height === 0) return;

    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach((t) => t.kill());

    // Calculate initial dimensions in px (50% or 70% of screen)
    const initialWidth = isMobile
      ? screenDimensions.width * 0.7
      : screenDimensions.width * 0.5;
    const initialHeight = isMobile
      ? screenDimensions.height * 0.7
      : screenDimensions.height * 0.7;

    /* ===============================
       MASK WINDOW EXPANSION (OPTIMIZED)
    =============================== */
    gsap.fromTo(
      maskRef.current,
      {
        width: `${initialWidth}px`,
        height: `${initialHeight}px`,
      },
      {
        width: `${screenDimensions.width}px`,
        height: `${screenDimensions.height}px`,
        borderRadius: "0px",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          end: "bottom 50%",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      }
    );

    /* ===============================
       ZOOM + PIN (OPTIMIZED)
    =============================== */
    gsap.to(videoContainerRef.current, {
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=120%",
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    /* ===============================
       VIDEO PLAY/PAUSE ON ENTER/LEAVE
    =============================== */
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 50%",
      end: "bottom -120%",
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

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isMobile, screenDimensions]);

  const handlePlayClick = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        "*"
      );
      setShowPlayButton(false);
    }
  };

  // Calculate initial dimensions for inline style
  const initialWidth = isMobile
    ? screenDimensions.width * 0.7
    : screenDimensions.width * 0.5;
  const initialHeight = isMobile
    ? screenDimensions.height * 0.7
    : screenDimensions.height * 0.5;

  return (
    <section ref={sectionRef} className="relative h-[100vh] bg-white">
      <div className="flex h-screen items-center justify-center">
        {/* Full-sized video container */}
        <div
          ref={videoContainerRef}
          className="relative h-screen w-screen overflow-hidden"
          style={{
            transform: "scale(1) translate3d(0,0,0)",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Video (always full size) */}
          <iframe
            ref={iframeRef}
            className="absolute inset-0 h-full w-full object-cover"
            src="https://www.youtube.com/embed/6-AjSG7Zw_4?enablejsapi=1&mute=1&controls=0&rel=0&playsinline=1"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{
              pointerEvents: showPlayButton ? "auto" : "none",
              touchAction: "none",
              transform: "translate3d(0,0,0)",
              backfaceVisibility: "hidden",
            }}
          />

          {/* Play button for mobile */}
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

          {/* White overlay mask with expanding window */}
          <div
            ref={maskRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[32px]"
            style={{
              width: `${initialWidth}px`,
              height: `${initialHeight}px`,
              boxShadow: "0 0 0 200vmax white",
              transform: "translate3d(0,0,0)",
              backfaceVisibility: "hidden",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </section>
  );
}
