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

  useEffect(() => {
    // Detect mobile device
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !videoContainerRef.current || !maskRef.current)
      return;

    /* ===============================
       MASK WINDOW EXPANSION (SMOOTHER)
    =============================== */
    gsap.fromTo(
      maskRef.current,
      {
        width: "50%",
        height: "50%",
      },
      {
        width: "100%",
        height: "100%",
        borderRadius: "0px",
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          end: "bottom 10%",
          scrub: 4,
          anticipatePin: 1,
        },
      }
    );

    /* ===============================
       ZOOM + PIN (SMOOTHER)
    =============================== */
    gsap.to(videoContainerRef.current, {
      scale: 1.08,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=400%",
        scrub: 4,
        pin: true,
        anticipatePin: 1,
      },
    });

    /* ===============================
       VIDEO PLAY/PAUSE ON ENTER/LEAVE
    =============================== */
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 50%",
      end: "bottom -300%",
      onEnter: () => {
        if (iframeRef.current) {
          if (isMobile) {
            // Show play button on mobile
            setShowPlayButton(true);
          } else {
            // Auto-play on desktop
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
  }, [isMobile]);

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
    <section ref={sectionRef} className="relative h-[100vh] bg-white">
      <div className="flex h-screen items-center justify-center">
        {/* Full-sized video container */}
        <div
          ref={videoContainerRef}
          className="relative h-screen w-screen overflow-hidden"
          style={{
            transform: "scale(1)",
            willChange: "transform",
          }}
        >
          {/* Video (always full size) */}
          <iframe
            ref={iframeRef}
            className="absolute inset-0 h-full w-full object-cover"
            src="https://www.youtube.com/embed/6-AjSG7Zw_4?enablejsapi=1&mute=1&controls=0&rel=0&playsinline=1"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />

          {/* Play button for mobile */}
          {showPlayButton && (
            <button
              onClick={handlePlayClick}
              className="absolute top-1/2 left-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-110 active:scale-95"
              aria-label="Play video"
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
              width: "50%",
              height: "50%",
              boxShadow: "0 0 0 200vmax white",
              willChange: "width, height, border-radius",
            }}
          />
        </div>
      </div>
    </section>
  );
}
