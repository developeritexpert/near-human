"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function VehicleTechStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(1);
  const [isReady, setIsReady] = useState(false);

  const slides = [
    { id: 1, src: "/img/Scootr-slidr-img2.png", alt: "Smart Safety Features" },
    { id: 2, src: "/img/Scootr-slidr-img1.png", alt: "AI-Powered Navigation" },
    { id: 3, src: "/img/Scootr-slidr-img3.png", alt: "Performance Analytics" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady || !sectionRef.current || !carouselContainerRef.current) return;

    ScrollTrigger.getById("vehicle-carousel-section")?.kill();

    let ctx: gsap.Context | null = null;

    const initScrollTrigger = () => {
      ctx = gsap.context(() => {
        const slots = imagesRef.current.filter(Boolean);
        if (slots.length !== 3) return;

        const positions = {
          left: { x: -320, scale: 0.7, opacity: 0.3, zIndex: 1 },
          center: { x: 0, scale: 1, opacity: 1, zIndex: 3 },
          right: { x: 320, scale: 0.7, opacity: 0.3, zIndex: 1 },
        };

        gsap.set(slots[0], positions.left);
        gsap.set(slots[1], positions.center);
        gsap.set(slots[2], positions.right);

        let currentSlots = [...slots];

        const tl = gsap.timeline({
          scrollTrigger: {
            id: "vehicle-carousel-section",
            trigger: carouselContainerRef.current,
            start: "top top+=100",
            end: `+=${slides.length * 400}`,
            scrub: 1,
            pin: carouselContainerRef.current,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = self.progress;
              const index = Math.round(progress * (slides.length - 1));
              setActiveIndex(index);
            },
          },
        });

        for (let step = 0; step < slides.length - 1; step++) {
          const label = `step-${step}`;

          tl.to(currentSlots[2], { ...positions.center, duration: 1, ease: "power2.inOut" }, label)
            .to(currentSlots[1], { ...positions.left, duration: 1, ease: "power2.inOut" }, label)
            .to(currentSlots[0], { ...positions.right, duration: 1, ease: "power2.inOut" }, label);

          currentSlots = [currentSlots[1], currentSlots[2], currentSlots[0]];
        }
      }, sectionRef);
    };

    const rafId = requestAnimationFrame(() => {
      const timer = setTimeout(() => {
        initScrollTrigger();
        ScrollTrigger.refresh();
      }, 350);

      return () => clearTimeout(timer);
    });

    return () => {
      cancelAnimationFrame(rafId);
      ScrollTrigger.getById("vehicle-carousel-section")?.kill();
      ctx?.revert();
    };
  }, [isReady, slides.length]);


  return (
    <section ref={sectionRef} className="relative bg-white">
      {/* Header Section - Scrolls normally */}
      <div
        ref={headerRef}
        className="relative bg-white px-[20px] md:px-[30px] lg:px-[50px] pt-[50px] md:pt-[70px] lg:pt-[100px] xl:pt-[136px] pb-[30px] md:pb-[50px]"
      >
        <div className="container mx-auto max-w-[1440px]">
          <div className="max-w-[550px] mx-auto text-center">
            <h2 className="text-[32px] md:text-[42px] lg:text-[55px]  text-[#101717] font-medium leading-tight">
              Seamless Retrofitting with your vehicle
              <span className="text-[#00B0B2]"> tech stack.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Carousel Section - This pins and animates */}
      <div
        ref={carouselContainerRef}
        className="relative bg-white px-[20px] md:px-[30px] lg:px-[50px] py-[30px] md:py-[50px]"
      >
        <div className="container mx-auto max-w-[1440px]">
          <div className="max-w-[1060px] mx-auto">
            {/* Images Carousel */}
            <div className="relative h-[350px] sm:h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden">
              {slides.map((item, i) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    if (el) imagesRef.current[i] = el;
                  }}
                  className="absolute flex justify-center items-center"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={500}
                    height={500}
                    className="w-auto h-auto max-w-[300px] sm:max-w-[350px] lg:max-w-[450px] xl:max-w-[500px] object-contain"
                    priority={i === 1}
                  />
                </div>
              ))}
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center gap-2 mt-[30px]">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-6 bg-[#00B0B2]"
                      : "w-2 bg-[#101717]/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Scrolls after carousel unpins */}
      <div className="relative bg-white px-[20px] md:px-[30px] lg:px-[50px] pb-[50px] md:pb-[70px]">
        <div className="container mx-auto max-w-[1440px]">
          {/* Bottom Border */}
          <div
            className="border border-transparent
            [border-image-source:linear-gradient(90deg,rgba(16,23,23,0)_0%,rgba(16,23,23,0.11)_50%,rgba(16,23,23,0)_100%)]
            [border-image-slice:1]"
          />
        </div>
      </div>
    </section>
  );
}

export default VehicleTechStack;