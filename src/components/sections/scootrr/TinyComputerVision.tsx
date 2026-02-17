"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function TinyComputerVision() {
  const [isMobile, setIsMobile] = useState(false);

  const config = {
    cameraFinalY: isMobile ? -60 : -100,
    cameraFinalX: 0,
    cameraFinalScale: 0.08,
    carouselXOffset: 300,
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
  const ctxRef = useRef<gsap.Context | null>(null);

  const frameCount = 35;
  const startFrame = 66;

  const features = [
    {
      side: "left",
      title: "Safety Features",
      desc: "Safety features that redefine electric mobility",
    },
    {
      side: "right",
      title: "Real-Time Hazard Detection",
      desc: "Alerts riders to potential hazards, including pedestrians, vehicles, and obstacles.",
    },
    {
      side: "left",
      title: "Semi-Autonomous Throttle Control",
      desc: "Dynamically adjusts the throttle to ensure safe speeds in different environments.",
    },
    {
      side: "right",
      title: "Pavement Riding Prevention",
      desc: "Discourages illegal riding on sidewalks by detecting surfaces and modifying controls.",
    },
    {
      side: "left",
      title: "Emergency Braking Support",
      desc: "Provides advanced braking assistance during sudden stops, reducing collision risks.",
    },
    {
      side: "right",
      title: "Enhanced Rider Behavior",
      desc: "Encourages compliance with traffic laws and promotes responsible riding.",
    },
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
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady || !containerRef.current || !canvasRef.current) return;

    if (ctxRef.current) {
      ctxRef.current.revert();
      ctxRef.current = null;
    }

    const isTouchDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = 1920;
    canvas.height = 1080;

    const images: HTMLImageElement[] = [];
    const airship = { frame: 0 };

    let loadedCount = 0;
    for (let i = 0; i < frameCount; i++) {
      const img = new window.Image() as HTMLImageElement;
      img.src = getImagePath(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === 1) render();
      };
      images.push(img);
    }

    const render = () => {
      if (!context || !images[airship.frame]) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(images[airship.frame], 0, 0);
    };

    const ctx = gsap.context(() => {
      // On touch devices: no pin, no scroll animation.
      // Just make everything visible so the section renders correctly.
      if (isTouchDevice) {
        gsap.set(carouselContainerRef.current, { autoAlpha: 1 });
        gsap.set(headerRef.current, { autoAlpha: 1, y: 0 });
        gsap.set(finalCameraRef.current, { autoAlpha: 1, scale: 1 });
        gsap.set(canvasWrapperRef.current, {
          scale: 1,
          x: 0,
          y: 0,
          autoAlpha: 1,
        });
        textRefs.current.forEach((ref) => {
          if (ref) gsap.set(ref, { autoAlpha: 1, y: 0 });
        });
        // Show the centre slide and make the carousel items visible
        const slots = sliderImagesRef.current.filter(Boolean);
        slots.forEach((el, i) => {
          gsap.set(el, {
            autoAlpha: i === 1 ? 1 : 0.4,
            x: (i - 1) * 160,
            scale: i === 1 ? 1 : 0.7,
          });
        });
        return; // skip all scroll animation setup on mobile
      }

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
          end: `+=${1500}%`,
          pin: !isTouchDevice,
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

      mainTl.to(airship, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        onUpdate: render,
        duration: 4,
      });

      features.forEach((feature, index) => {
        const element = textRefs.current[index];
        if (!element) return;

        mainTl.to(
          element,
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" },
          `feature-${index}`
        );
        mainTl.to(element, { duration: 0.2 });
        mainTl.to(element, {
          autoAlpha: 0,
          y: -50,
          duration: 0.5,
          ease: "power3.in",
        });
      });

      mainTl.to(
        containerRef.current,
        { backgroundColor: "#ffffff", duration: 2.5, ease: "power2.inOut" },
        "transition"
      );

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
        { autoAlpha: 0, duration: 1.5, ease: "power2.out" },
        "transition+=1.5"
      );

      mainTl.to(
        finalCameraRef.current,
        { autoAlpha: 1, scale: 1, duration: 2, ease: "power2.out" },
        "transition+=1"
      );

      mainTl.to(
        headerRef.current,
        { autoAlpha: 1, y: 0, duration: 1.5, ease: "power3.out" },
        "transition+=1.5"
      );

      mainTl.to(
        carouselContainerRef.current,
        { autoAlpha: 1, duration: 1.5, ease: "power2.out" },
        "transition+=1.5"
      );

      const slots = sliderImagesRef.current.filter(
        (el): el is HTMLDivElement => el !== null
      );

      const positions = {
        left: {
          x: -config.carouselXOffset,
          scale: 0.7,
          autoAlpha: 0.4,
          zIndex: 1,
        },
        center: { x: 0, scale: 1, autoAlpha: 1, zIndex: 3 },
        right: {
          x: config.carouselXOffset,
          scale: 0.7,
          autoAlpha: 0.4,
          zIndex: 1,
        },
      };

      if (slots[0]) gsap.set(slots[0], { ...positions.left, autoAlpha: 0 });
      if (slots[1]) gsap.set(slots[1], { ...positions.center, autoAlpha: 0 });
      if (slots[2]) gsap.set(slots[2], { ...positions.right, autoAlpha: 0 });

      mainTl.to(
        slots,
        {
          autoAlpha: (i) => (i === 1 ? 1 : 0.4),
          duration: 0.5,
          stagger: 0.15,
          ease: "power2.out",
        },
        "carousel"
      );

      let currentSlots = [...slots];
      for (let step = 0; step < slides.length - 1; step++) {
        const stepLabel = `carousel-step-${step}`;
        mainTl.addLabel(stepLabel, "+=0.3");

        mainTl.to(
          currentSlots[2],
          { ...positions.center, duration: 1, ease: "power2.inOut" },
          stepLabel
        );
        mainTl.to(
          currentSlots[1],
          { ...positions.left, duration: 1, ease: "power2.inOut" },
          stepLabel
        );
        mainTl.to(
          currentSlots[0],
          { ...positions.right, duration: 1, ease: "power2.inOut" },
          stepLabel
        );

        currentSlots = [currentSlots[1], currentSlots[2], currentSlots[0]];
      }

      mainTl.to({}, { duration: 0.5 });
    }, containerRef);

    ctxRef.current = ctx;

    return () => {
      ctx.revert();
      ctxRef.current = null;
    };
  }, [isReady]);

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

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#0A1016]"
    >
      <div className="relative flex min-h-screen flex-col items-center justify-center">
        <div
          ref={headerRef}
          className="pointer-events-none absolute top-[10%] z-[35] w-full px-6 text-center"
          style={{ opacity: 0, visibility: "hidden" }}
        />

        <div
          ref={canvasWrapperRef}
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
          style={{ transformOrigin: "center center" }}
        >
          <canvas
            ref={canvasRef}
            className="block h-full max-h-[85vh] w-full object-contain"
            style={{ margin: "auto" }}
          />
        </div>

        <div
          ref={finalCameraRef}
          className="pointer-events-none absolute z-[40] flex items-center justify-center"
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
            className="h-auto w-[100] lg:w-auto"
            priority
          />
        </div>

        <div className="pointer-events-none relative z-30 mx-auto h-full w-full max-w-[1440px] px-10">
          {features.map((f, i) => (
            <div
              key={i}
              ref={(el) => {
                textRefs.current[i] = el;
              }}
              className={`absolute top-3/4 max-w-[320px] -translate-y-1/2 md:top-1/2 ${
                f.side === "left"
                  ? "left-10 w-[calc(100%-40px)] text-left"
                  : "right-10 w-[calc(100%-40px)] text-right"
              }`}
              style={{ opacity: 0, visibility: "hidden" }}
            >
              <h2 className="3xl:text-xl text-md mb-3 font-bold tracking-widest text-[#00B0B2] uppercase xl:text-lg">
                {f.title}
              </h2>
              <p className="3xl:text-5xl text-lg leading-tight font-semibold text-white mix-blend-difference xl:text-3xl">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        <div
          ref={carouselContainerRef}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center"
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
                  className="h-auto w-[100px] w-auto object-contain lg:w-[200px]"
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
