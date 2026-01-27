"use client";

import { useEffect, useRef, useCallback } from "react";

function ImageSec() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null); // New ref for scaling container
  const isPlayingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scaleRef = useRef(0.8); // Start at 80% scale
  const animationFrameRef = useRef<number>(0);

  // Debounced play/pause function
  const handleVisibilityChange = useCallback((isVisible: boolean) => {
    if (!iframeRef.current?.contentWindow) return;

    // Prevent redundant commands
    if (isVisible && isPlayingRef.current) return;
    if (!isVisible && !isPlayingRef.current) return;

    // Small delay to ensure iframe is ready
    setTimeout(() => {
      try {
        const message = isVisible
          ? '{"event":"command","func":"playVideo","args":""}'
          : '{"event":"command","func":"pauseVideo","args":""}';

        iframeRef.current?.contentWindow?.postMessage(message, "*");
        isPlayingRef.current = isVisible;
      } catch (error) {
        console.error("YouTube API error:", error);
      }
    }, 100);
  }, []);

  // Handle scroll-based scaling
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !videoContainerRef.current) return;

      // Get container position relative to viewport
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress based on container's vertical position
      // When container is at the top: scale = 0.8 (80%)
      // When container is in the middle: scale = 1 (100%)
      const progress = Math.max(
        0,
        Math.min(1, (windowHeight / 2 - rect.top) / (windowHeight / 2))
      );

      // Smooth easing function for natural scaling
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);

      // Calculate scale (from 0.8 to 1)
      const newScale = 0.8 + 0.2 * easedProgress;
      scaleRef.current = newScale;

      // Cancel previous animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Use requestAnimationFrame for smooth updates
      animationFrameRef.current = requestAnimationFrame(() => {
        if (videoContainerRef.current) {
          videoContainerRef.current.style.transform = `scale(${newScale})`;
          videoContainerRef.current.style.transition =
            "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        }
      });
    };

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", throttledScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Intersection Observer for play/pause
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        // Clear previous timeout to prevent multiple rapid triggers
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
          handleVisibilityChange(entry.isIntersecting);
        }, 50); // Small delay to smooth scroll events
      },
      {
        threshold: 0.6,
        rootMargin: "50px", // Adds buffer zone
      }
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      observerRef.current?.disconnect();
    };
  }, [handleVisibilityChange]);

  // Wait for iframe to be ready
  useEffect(() => {
    const handleIframeLoad = () => {
      // Initial scale setup on the video container
      if (videoContainerRef.current) {
        videoContainerRef.current.style.transform = "scale(0.8)";
        videoContainerRef.current.style.transformOrigin = "center center";
        videoContainerRef.current.style.willChange = "transform";
      }

      // Give YouTube player time to initialize
      setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          // Send pause command initially
          iframeRef.current.contentWindow.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            "*"
          );
        }
      }, 500);
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", handleIframeLoad);
      return () => iframe.removeEventListener("load", handleIframeLoad);
    }
  }, []);

  return (
    <section className="relative px-[20px] md:px-[30px]">
      {/* Background image moved outside container for proper scaling */}

      <div className="relative">
        {/* This wrapper ensures the video container is positioned correctly */}
        <div className="relative h-[60vh] sm:h-[70vh] md:h-[90vh]">
          <div
            ref={containerRef}
            className="relative h-full overflow-hidden rounded-[15px] md:rounded-[30px]"
          >
            {/* Video container with scaling - NOW THIS DIV GETS SCALED */}
            <div
              ref={videoContainerRef}
              className="relative h-full w-full origin-center overflow-hidden rounded-[15px] md:rounded-[30px]"
              style={{
                willChange: "transform",
              }}
            >
              <img
                src="/img/Sctr-img-sec.png"
                alt="Scooter"
                className="absolute inset-0 -z-10 h-full w-full object-cover"
                loading="lazy"
              />
              <iframe
                ref={iframeRef}
                className="absolute inset-0 h-full w-full object-cover"
                src="https://www.youtube.com/embed/6-AjSG7Zw_4?enablejsapi=1&autoplay=0&mute=1&controls=0&rel=0&modestbranding=1"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ImageSec;
