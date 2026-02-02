"use client";

import { useEffect, useRef, useCallback } from "react";

function ImageSec() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const isPlayingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scaleRef = useRef(0.8);
  const animationFrameRef = useRef<number>(0);
  const lastScrollTimeRef = useRef<number>(0);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Handle scroll-based scaling - FIXED VERSION
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current || !videoContainerRef.current) return;

      // Get container position relative to viewport
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress based on container's vertical position
      const progress = Math.max(
        0,
        Math.min(1, (windowHeight / 2 - rect.top) / (windowHeight / 2))
      );

      // Smooth easing function
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);

      // Calculate scale (from 0.8 to 1)
      const newScale = 0.8 + 0.2 * easedProgress;
      scaleRef.current = newScale;

      // Apply transform WITHOUT transition during scroll
      videoContainerRef.current.style.transform = `scale(${newScale})`;
    };

    const handleScroll = () => {
      const now = Date.now();
      lastScrollTimeRef.current = now;

      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        // Remove transition during active scrolling
        if (videoContainerRef.current) {
          videoContainerRef.current.style.transition = "none";
        }
      }

      // Clear any pending scroll end timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Cancel previous animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Use requestAnimationFrame for smooth updates
      animationFrameRef.current = requestAnimationFrame(updateScale);

      // Set timeout for scroll end detection
      scrollTimeoutRef.current = setTimeout(() => {
        const timeSinceLastScroll = Date.now() - lastScrollTimeRef.current;

        // If no scroll for 100ms, consider scrolling ended
        if (timeSinceLastScroll > 100) {
          isScrollingRef.current = false;

          // Re-enable transition after scroll ends for smooth return
          if (videoContainerRef.current) {
            videoContainerRef.current.style.transition =
              "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

            // One final update with transition
            requestAnimationFrame(() => {
              if (videoContainerRef.current) {
                videoContainerRef.current.style.transform = `scale(${scaleRef.current})`;
              }
            });
          }
        }
      }, 100);
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
    updateScale(); // Initial call

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
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
        videoContainerRef.current.style.transition =
          "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
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
      <div className="relative">
        <div className="relative h-[60vh] sm:h-[70vh] md:h-[90vh]">
          <div
            ref={containerRef}
            className="relative h-full overflow-hidden rounded-[15px] md:rounded-[30px]"
          >
            {/* Video container with scaling */}
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
