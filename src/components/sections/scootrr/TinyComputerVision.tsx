"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function TinyComputerVision() {
  const config = {
    cameraFinalY: -120,
    cameraFinalX: 0,
    cameraFinalScale: 0.08,
    carouselXOffset: 350,
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const finalCameraRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const sliderImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(1);
  const [isReady, setIsReady] = useState(false);

  const frameCount = 35;
  const startFrame = 66;

  const features = [
    { side: "left", title: "Safety Features", desc: "Safety features that redefine electric mobility" },
    { side: "right", title: "Real-Time Hazard Detection", desc: "Alerts riders to potential hazards, including pedestrians, vehicles, and obstacles." },
    { side: "left", title: "Semi-Autonomous Throttle Control", desc: "Dynamically adjusts the throttle to ensure safe speeds in different environments." },
    { side: "right", title: "Pavement Riding Prevention", desc: "Discourages illegal riding on sidewalks by detecting surfaces and modifying controls." },
    { side: "left", title: "Emergency Braking Support", desc: "Provides advanced braking assistance during sudden stops, reducing collision risks." },
    { side: "right", title: "Enhanced Rider Behavior", desc: "Encourages compliance with traffic laws and promotes responsible riding." }
  ];

  const slides = [
    { id: 1, src: "/img/Scootr-slidr-img2.png", alt: "Smart Safety Features" },
    { id: 2, src: "/img/Scootr-slidr-img1.png", alt: "AI-Powered Navigation" },
    { id: 3, src: "/img/Scootr-slidr-img3.png", alt: "Performance Analytics" },
  ];

  const getImagePath = (index: number) => {
    const frameNumber = (startFrame + index).toString().padStart(4, "0");
    return `/img/sequence/Animation${frameNumber}.png`;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
      ScrollTrigger.refresh();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady || !containerRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = 1920;
    canvas.height = 1080;

    const images: HTMLImageElement[] = [];
    const airship = { frame: 0 };

    // Preload all images
    let loadedCount = 0;
    for (let i = 0; i < frameCount; i++) {
      const img = new window.Image() as HTMLImageElement;
      img.src = getImagePath(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === 1) render(); // Render first frame immediately
      };
      images.push(img);
    }

    const render = () => {
      if (!context || !images[airship.frame]) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(images[airship.frame], 0, 0);
    };

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(carouselContainerRef.current, { autoAlpha: 0 });
      gsap.set(headerRef.current, { autoAlpha: 0, y: 30 });
      gsap.set(finalCameraRef.current, { autoAlpha: 0, scale: 0.5 });
      gsap.set(canvasWrapperRef.current, { scale: 1, x: 0, y: 0 });
      
      textRefs.current.forEach((ref) => {
        if (ref) gsap.set(ref, { autoAlpha: 0, y: 50 });
      });

      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${2500}%`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            if (progress > 0.65) {
              const carouselProgress = (progress - 0.65) / 0.35;
              const index = Math.round(carouselProgress * (slides.length - 1));
              setActiveIndex(Math.min(Math.max(index, 0), slides.length - 1));
            }
          },
        },
      });

      // 1. Image Sequence Animation
      mainTl.to(airship, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        onUpdate: render,
        duration: 4,
      });

      // 2. Feature Text Animations with proper fade in/out
      features.forEach((feature, index) => {
        const element = textRefs.current[index];
        if (!element) return;

        // Fade in
        mainTl.to(
          element,
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
          },
          `feature-${index}`
        );

        // Hold
        mainTl.to(element, { duration: 1.5 });

        // Fade out
        mainTl.to(element, {
          autoAlpha: 0,
          y: -50,
          duration: 1.2,
          ease: "power3.in",
        });
      });

      // 3. TRANSITION - Background color change
      mainTl.to(
        containerRef.current,
        {
          backgroundColor: "#ffffff",
          duration: 2.5,
          ease: "power2.inOut",
        },
        "transition"
      );

      // 4. Canvas zoom out and fade - FIXED CENTERING
      mainTl.to(
        canvasWrapperRef.current,
        {
          scale: config.cameraFinalScale,
          y: config.cameraFinalY,
          x: config.cameraFinalX,
          duration: 2.5,
          ease: "power2.inOut",
        },
        "transition"
      );

      mainTl.to(
        canvasWrapperRef.current,
        {
          autoAlpha: 0,
          duration: 1.5,
          ease: "power2.out",
        },
        "transition+=1.5"
      );

      // 5. Final camera fade in - perfectly aligned
      mainTl.to(
        finalCameraRef.current,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 2,
          ease: "power2.out",
        },
        "transition+=1"
      );

      // 6. Header fade in with smooth animation
      mainTl.to(
        headerRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
        },
        "transition+=1.5"
      );

      // 7. Carousel container fade in
      mainTl.to(
        carouselContainerRef.current,
        {
          autoAlpha: 1,
          duration: 1.5,
          ease: "power2.out",
        },
        "transition+=1.5"
      );

      // 8. Carousel Slides Animation
      const slots = sliderImagesRef.current.filter(
        (el): el is HTMLDivElement => el !== null
      );

      const positions = {
        left: { x: -config.carouselXOffset, scale: 0.7, autoAlpha: 0.4, zIndex: 1 },
        center: { x: 0, scale: 1, autoAlpha: 1, zIndex: 3 },
        right: { x: config.carouselXOffset, scale: 0.7, autoAlpha: 0.4, zIndex: 1 },
      };

      // Set initial positions for carousel items
      if (slots[0]) gsap.set(slots[0], { ...positions.left, autoAlpha: 0 });
      if (slots[1]) gsap.set(slots[1], { ...positions.center, autoAlpha: 0 });
      if (slots[2]) gsap.set(slots[2], { ...positions.right, autoAlpha: 0 });

      // Fade in carousel items with stagger
      mainTl.to(
        slots,
        {
          autoAlpha: (i) => (i === 1 ? 1 : 0.4),
          duration: 1.2,
          stagger: 0.15,
          ease: "power2.out",
        },
        "carousel"
      );

      // Carousel rotation animation
      let currentSlots = [...slots];
      for (let step = 0; step < slides.length - 1; step++) {
        const stepLabel = `carousel-step-${step}`;
        
        mainTl.addLabel(stepLabel, "+=1");
        
        mainTl.to(
          currentSlots[2],
          {
            ...positions.center,
            duration: 1.8,
            ease: "power2.inOut",
          },
          stepLabel
        );
        
        mainTl.to(
          currentSlots[1],
          {
            ...positions.left,
            duration: 1.8,
            ease: "power2.inOut",
          },
          stepLabel
        );
        
        mainTl.to(
          currentSlots[0],
          {
            ...positions.right,
            duration: 1.8,
            ease: "power2.inOut",
          },
          stepLabel
        );

        // Rotate array for next iteration
        currentSlots = [currentSlots[1], currentSlots[2], currentSlots[0]];
      }

      // Final hold
      mainTl.to({}, { duration: 2 });

    }, containerRef);

    // Refresh after setup
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isReady]);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#0A1016]"
    >
      <div className="relative min-h-screen flex flex-col items-center justify-center">
        {/* Carousel Header */}
        <div
          ref={headerRef}
          className="absolute top-[10%] z-[35] w-full text-center px-6 pointer-events-none"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          {/* <h2 className="text-[32px] md:text-[52px] leading-tight font-medium text-[#101717]">
            Seamless Retrofitting with your vehicle{" "}
            <span className="text-[#00B0B2]">tech stack.</span>
          </h2> */}
        </div>

        {/* Animation Canvas - Wrapped for proper centering during scale */}
        <div
          ref={canvasWrapperRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          style={{ transformOrigin: "center center" }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain max-h-[85vh] block"
            style={{ margin: "auto" }}
          />
        </div>

        {/* Static Camera - Properly centered */}
        <div
          ref={finalCameraRef}
          className="absolute z-[40] pointer-events-none flex items-center justify-center"
          style={{
            top: `calc(50% + ${config.cameraFinalY}px)`,
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0,
            visibility: "hidden",
          }}
        >
          <Image
            src="/img/camera.webp"
            alt="Camera"
            width={100}
            height={100}
            className="h-auto w-auto"
            priority
          />
        </div>

        {/* Text Layers */}
        <div className="relative z-30 w-full max-w-[1440px] h-full mx-auto px-10 pointer-events-none">
          {features.map((f, i) => (
            <div
              key={i}
              ref={(el) => {
                textRefs.current[i] = el;
              }}
              className={`absolute top-1/2 -translate-y-1/2 max-w-[420px] ${
                f.side === "left" ? "left-10 text-left" : "right-10 text-right"
              }`}
              style={{ opacity: 0, visibility: "hidden" }}
            >
              <h2 className="text-[#00B0B2] text-xl font-bold mb-3 uppercase tracking-widest">
                {f.title}
              </h2>
              <p className="text-white text-3xl md:text-5xl font-semibold leading-tight mix-blend-difference">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Carousel */}
        <div
          ref={carouselContainerRef}
          className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          <div className="relative flex h-[550px] w-full items-center justify-center overflow-hidden">
            {slides.map((item, i) => (
              <div
                key={item.id}
                ref={(el) => {
                  if (el) sliderImagesRef.current[i] = el;
                }}
                className="absolute flex items-center justify-center will-change-transform"
                style={{ opacity: 0 }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={500}
                  height={500}
                  className="h-auto w-auto max-w-[340px] lg:max-w-[500px] object-contain"
                  priority={i === 1}
                />
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-500 ease-out ${
                  index === activeIndex
                    ? "w-6 bg-[#00B0B2]"
                    : "w-2 bg-[#101717]/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TinyComputerVision;