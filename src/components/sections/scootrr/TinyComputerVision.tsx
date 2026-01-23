"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function TinyComputerVision() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isReady, setIsReady] = useState(false);

  const featuresData = [
    { 
      id: 1, 
      title: "Safety Features that redefine micromobility",
      image: "/img/img-sc-1.png",
      layout: "text-left" // Text Left, Img Right
    },
    { 
      id: 2, 
      title: "AI-Powered Object Recognition with 99.9% accuracy",
      image: "/img/img-sc-2.png",
      layout: "img-left" // Img Left, Text Right
    },
    { 
      id: 3, 
      title: "Ultra-Low Power Consumption for extended battery life",
      image: "/img/img-sc-3.png",
      layout: "img-left" // Img Left, Text Right
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady || !containerRef.current) return;

    let ctx: gsap.Context = gsap.context(() => {
        const slides = slidesRef.current;
        
        // Initial States: Slide 1 visible, others hidden
        gsap.set(slides, { opacity: 0, zIndex: (i) => i + 1 });
        gsap.set(slides[0], { opacity: 1 });

        // Master Timeline attached to ScrollTrigger Pin
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=300%", // Pin for 3 screen heights
                pin: true,
                scrub: 0.5,
            }
        });

        // TRANSITION 1: Slide 0 -> Slide 1
        // Sequential to avoid "messy" overlap
        tl.to(slides[0], { opacity: 0, duration: 0.5, ease: "power2.inOut" }, 0.2); // Fade Out 0
        tl.to(slides[1], { opacity: 1, duration: 0.5, ease: "power2.inOut" }, 0.7); // Fade In 1 (After 0 is gone)

        // TRANSITION 2: Slide 1 -> Slide 2
        tl.to(slides[1], { opacity: 0, duration: 0.5, ease: "power2.inOut" }, 1.7); // Fade Out 1
        tl.to(slides[2], { opacity: 1, duration: 0.5, ease: "power2.inOut" }, 2.2); // Fade In 2 (After 1 is gone)

    }, containerRef);

    return () => ctx.revert();
  }, [isReady]);
  
  return (
    <section 
        ref={containerRef} 
        className="relative w-full h-screen overflow-hidden" 
    >
      
      {/* SCOPED BACKGROUND */}
      <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src="/img/bg-for-animation.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-[#0A1016]/30" />
      </div>

      {/* SLIDES CONTAINER */}
      <div className="relative w-full h-full z-10 max-w-[1440px] mx-auto">
         
            {featuresData.map((item, index) => (
                <div 
                    key={item.id}
                    ref={(el) => { slidesRef.current[index] = el; }}
                    className="absolute inset-0 w-full h-full flex items-center justify-center px-[20px] md:px-[50px] lg:px-[80px]"
                >
                    <div className={`flex flex-col lg:flex-row items-center justify-between w-full h-full lg:h-auto gap-10 lg:gap-20 ${item.layout === 'text-left' ? '' : 'lg:flex-row-reverse'}`}>
                        
                        {/* TEXT SIDE */}
                        <div className="w-full lg:w-1/2 flex flex-col justify-center">
                            <div className="w-[60px] h-[60px] border-2 border-[#00B0B2] rounded-full flex justify-center items-center text-[#00B0B2] text-xl font-bold mb-6">
                                {item.id}
                            </div>
                            <h2 className="text-[32px] md:text-[45px] lg:text-[60px] leading-tight font-[450] text-white drop-shadow-lg">
                                {item.title}
                            </h2>
                        </div>

                        {/* IMAGE SIDE */}
                        <div className="w-full lg:w-1/2 flex justify-center items-center">
                            {/* Constrained Image Size - Much Smaller */}
                            <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={400}
                                    height={400}
                                    className="w-full h-auto object-contain drop-shadow-2xl"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            ))}

      </div>

    </section>
  );
}

export default TinyComputerVision;
