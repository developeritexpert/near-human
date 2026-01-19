// components/ScrollSection.tsx
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Initialize GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface ScrollItem {
  id: number;
  title: string;
  description: string;
}

interface ScrollSectionProps {
  items: ScrollItem[];
}

export default function ScrollSection({ items }: ScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const textItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const pointerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !pinRef.current || items.length === 0) return;

    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Calculate total scroll height needed
    const totalScrollHeight = items.length * window.innerHeight;

    // Set container height for scrolling
    if (containerRef.current) {
      containerRef.current.style.height = `${totalScrollHeight}px`;
    }

    // Create the pinned section
    const pinTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${totalScrollHeight}`,
      pin: pinRef.current,
      pinSpacing: false,
      scrub: 1,
      anticipatePin: 1,
      markers: false, // Set to true for debugging
    });

    // Create text animations
    items.forEach((_, index) => {
      const textElement = textItemsRef.current[index];
      if (!textElement) return;

      // Calculate trigger positions
      const startPosition = index * window.innerHeight;
      const endPosition = (index + 1) * window.innerHeight;

      // Create scroll trigger for this text item
      const textTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: startPosition,
        end: endPosition,
        onEnter: () => {
          // Fade in current item
          gsap.to(textElement, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          });

          // Fade out all other items
          textItemsRef.current.forEach((item, i) => {
            if (item && i !== index) {
              gsap.to(item, {
                y: 50,
                opacity: 0,
                duration: 0.5,
                ease: "power2.in",
              });
            }
          });
        },
        onLeave: () => {
          if (index < items.length - 1) {
            gsap.to(textElement, {
              y: -50,
              opacity: 0,
              duration: 0.5,
              ease: "power2.in",
            });
          }
        },
        onEnterBack: () => {
          gsap.to(textElement, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          });

          // Hide items that come after
          textItemsRef.current.forEach((item, i) => {
            if (item && i > index) {
              gsap.to(item, {
                y: 50,
                opacity: 0,
                duration: 0.5,
                ease: "power2.in",
              });
            }
          });
        },
        onLeaveBack: () => {
          if (index > 0) {
            gsap.to(textElement, {
              y: 50,
              opacity: 0,
              duration: 0.5,
              ease: "power2.in",
            });
          }
        },
      });
    });

    // Create pointer animation
    if (pointerRef.current && textContainerRef.current) {
      const pointerTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: totalScrollHeight,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const pointerHeight = pointerRef.current?.offsetHeight || 80;
          const containerHeight =
            textContainerRef.current?.offsetHeight || window.innerHeight;

          const maxTop = containerHeight - pointerHeight;
          const topPosition = progress * maxTop;

          gsap.to(pointerRef.current, {
            top: topPosition,
            duration: 0.1,
            ease: "none",
          });
        },
      });
    }

    // Refresh ScrollTrigger on resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      window.removeEventListener("resize", handleResize);
    };
  }, [items]);

  return (
    <section ref={containerRef} className="relative w-full">
      {/* Pinned Container - stays fixed while scrolling */}
      <div ref={pinRef} className="fixed top-0 left-0 flex h-screen w-full">
        {/* Left side - Text content with pointer */}
        <div className="relative h-full w-1/2">
          {/* Pointer indicator */}
          <div
            ref={pointerRef}
            className="absolute left-8 z-20 h-24 w-1 rounded-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 shadow-xl"
          />

          {/* Text container */}
          <div
            ref={textContainerRef}
            className="relative flex h-full flex-col justify-center px-8 md:px-12 lg:px-16 xl:px-20"
          >
            <div className="relative h-96 w-full overflow-hidden">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    textItemsRef.current[index] = el;
                  }}
                  className={`absolute top-0 left-0 w-full max-w-2xl ${
                    index === 0
                      ? "translate-y-0 opacity-100"
                      : "translate-y-12 opacity-0"
                  } transition-all duration-500`}
                >
                  <div className="mb-8">
                    <span className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-600">
                      Step {index + 1}/{items.length}
                    </span>
                    <h3 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-base leading-relaxed text-gray-600 md:text-lg lg:text-xl">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-8 flex items-center gap-2 text-sm text-gray-500">
              <div className="relative h-8 w-2 rounded-full border-2 border-gray-300">
                <div className="animate-scroll-indicator absolute top-0 left-0 h-1/3 w-full rounded-full bg-gray-400" />
              </div>
              <span>Scroll to continue</span>
            </div>
          </div>
        </div>

        {/* Right side - Static image */}
        <div className="relative h-full w-1/2">
          <div
            ref={imageRef}
            className="sticky top-0 flex h-screen items-center justify-center p-4 md:p-8"
          >
            <div className="relative h-4/5 w-full max-w-4xl overflow-hidden rounded-2xl shadow-xl md:rounded-3xl md:shadow-2xl">
              {/* Static image/background */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                <div className="p-8 text-center">
                  <div className="mb-4 text-4xl font-bold text-gray-300 md:text-6xl">
                    Static Content
                  </div>
                  <p className="mx-auto max-w-md text-gray-500">
                    This image remains fixed while the text on the left changes
                    with your scroll
                  </p>
                </div>
              </div>

              {/* Decorative element */}
              <div className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
                <span className="text-xs font-medium text-gray-700 md:text-sm">
                  Fixed View
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
