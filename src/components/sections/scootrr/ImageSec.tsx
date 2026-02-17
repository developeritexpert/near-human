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
  const playTriggerRef = useRef<ScrollTrigger | null>(null);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();

    const handleResize = () => {
      checkMobile();
      setScreenDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    setScreenDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Main animation effect
  useEffect(() => {
    if (!sectionRef.current || !videoContainerRef.current || !maskRef.current)
      return;
    if (screenDimensions.width === 0 || screenDimensions.height === 0) return;

    if (ctxRef.current) {
      ctxRef.current.revert();
      ctxRef.current = null;
    }

    // Kill previous playTrigger if exists
    if (playTriggerRef.current) {
      playTriggerRef.current.kill();
      playTriggerRef.current = null;
    }

    // Calculate sizes based on current screen and device
    const initialWidth = isMobile
      ? screenDimensions.width * 0.9
      : screenDimensions.width * 0.5;
    const initialHeight = isMobile
      ? screenDimensions.height * 0.5
      : screenDimensions.height * 0.7;

    const ctx = gsap.context(() => {
      // --- PLAY/PAUSE LOGIC (Works on both) ---
      function handleVideoPlay(shouldPlay: boolean) {
        if (!iframeRef.current) return;
        if (isMobile) {
          setShowPlayButton(shouldPlay);
        } else {
          const command = shouldPlay ? "playVideo" : "pauseVideo";
          iframeRef.current.contentWindow?.postMessage(
            `{"event":"command","func":"${command}","args":""}`,
            "*"
          );
        }
      }

      // Create and store the play trigger
      playTriggerRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 50%",
        end: "bottom -120%",
        onEnter: () => handleVideoPlay(true),
        onLeave: () => handleVideoPlay(false),
        onEnterBack: () => handleVideoPlay(true),
        onLeaveBack: () => handleVideoPlay(false),
      });

      // --- DESKTOP-ONLY SCROLL ANIMATIONS ---
      if (!isMobile) {
        // Mask expansion
        gsap.fromTo(
          maskRef.current,
          {
            width: initialWidth,
            height: initialHeight,
            borderRadius: "32px",
          },
          {
            width: screenDimensions.width,
            height: screenDimensions.height,
            borderRadius: 0,
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

        // Pin and scale animation
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
      } else {
        // --- MOBILE: NO PIN, just set initial state ---
        gsap.set(maskRef.current, {
          width: initialWidth,
          height: initialHeight,
          borderRadius: "32px",
        });
        gsap.set(videoContainerRef.current, { scale: 1 });
      }
    }, sectionRef);

    ctxRef.current = ctx;

    return () => {
      if (playTriggerRef.current) {
        playTriggerRef.current.kill();
        playTriggerRef.current = null;
      }
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, [isMobile, screenDimensions]);

  // Handle play button click for mobile
  const handlePlayClick = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        "*"
      );
      setShowPlayButton(false);
    }
  };

  // Calculate initial style for mask
  const initialWidth = isMobile
    ? screenDimensions.width * 0.9
    : screenDimensions.width * 0.5;
  const initialHeight = isMobile
    ? screenDimensions.height * 0.5
    : screenDimensions.height * 0.7;

  return (
    <section ref={sectionRef} className="relative h-screen bg-white">
      <div className="flex h-full items-center justify-center">
        <div
          ref={videoContainerRef}
          className="relative h-screen w-screen overflow-hidden"
          style={{
            transform: "scale(1) translate3d(0,0,0)",
            backfaceVisibility: "hidden",
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
              transform: "translate3d(0,0,0)",
              backfaceVisibility: "hidden",
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

          {/* Mask Div */}
          <div
            ref={maskRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[32px]"
            style={{
              width: initialWidth,
              height: initialHeight,
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
