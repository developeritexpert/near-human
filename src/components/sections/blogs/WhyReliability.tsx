"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CTAbutton from "@/components/layout/CTAbutton";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function WhyReliability() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const imageOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(imageRef.current, { 
        x: -100, 
        opacity: 0,
        scale: 0.9
      });
      
      gsap.set(imageOverlayRef.current, {
        scaleX: 1,
        transformOrigin: "right center"
      });

      gsap.set([tagRef.current, dateRef.current, titleRef.current, descRef.current, buttonRef.current], {
        y: 50,
        opacity: 0
      });

      // Create timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play none none reverse",
        }
      });

      // Image animation with reveal effect
      tl.to(imageRef.current, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power3.out"
      })
      .to(imageOverlayRef.current, {
        scaleX: 0,
        duration: 0.8,
        ease: "power2.inOut"
      }, "-=0.6")
      
      // Staggered content animations
      .to(tagRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4")
      .to(dateRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4")
      .to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4")
      .to(descRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.5")
      .to(buttonRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, "-=0.4");

      // Hover animation for image
      const imageElement = imageRef.current;
      if (imageElement) {
        imageElement.addEventListener("mouseenter", () => {
          gsap.to(imageElement.querySelector("img"), {
            scale: 1.05,
            duration: 0.5,
            ease: "power2.out"
          });
        });

        imageElement.addEventListener("mouseleave", () => {
          gsap.to(imageElement.querySelector("img"), {
            scale: 1,
            duration: 0.5,
            ease: "power2.out"
          });
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Button hover animation handlers
  const handleButtonEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    });
    gsap.to(e.currentTarget.querySelector(".btn-bg"), {
      scale: 1,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleButtonLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
    gsap.to(e.currentTarget.querySelector(".btn-bg"), {
      scale: 0,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  return (
    <div ref={sectionRef}>
      <section className="px-[20px] md:px-[30px] lg:px-[60px] py-[60px] md:py-[80px] lg:py-[100px]">
        <div className="flex gap-[40px] lg:gap-[60px] flex-col lg:items-center lg:flex-row">
          
          {/* Image Container */}
          <div 
            ref={imageRef}
            className="flex-1 relative rounded-[15px] overflow-hidden group cursor-pointer "
          >
            {/* Image reveal overlay */}
            <div 
              ref={imageOverlayRef}
              className="absolute inset-0 bg-[#00B0B2] z-10"
            />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[5]" />
            
            <img 
              src="/img/blog-realibility-img.png" 
              alt="Blog reliability" 
              className="w-full h-auto transition-transform duration-500"
            />
            
            {/* Floating badge on image */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
              <span className="text-[#00B0B2] text-sm font-medium">Featured</span>
            </div>
          </div>

          {/* Content Container */}
          <div ref={contentRef} className="flex-1">
            {/* Tag */}
            <p 
              ref={tagRef}
              className="text-[#00B0B2] text-[16px] font-[450] mb-[12px] inline-block relative"
            >
              <span className="relative z-10">Blogs</span>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00B0B2]/20 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </p>

            {/* Date */}
            <p 
              ref={dateRef}
              className="text-[#9F9F9F] text-[16px] font-[450] mb-[17px] flex items-center gap-2"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              Nov 27, 2025
            </p>

            {/* Title */}
            <h4 
              ref={titleRef}
              className="text-[#101717] text-[28px] md:text-[32px] lg:text-[38px] font-[450] mb-[13px] max-w-[653px] leading-[1.2]"
            >
              Real-World AI Is Hard: Why Reliability Outweighs Novelty in Everyday Devices
            </h4>

            {/* Description */}
            <p 
              ref={descRef}
              className="text-[#9F9F9F] text-[18px] font-medium mb-[37px] max-w-[660px] leading-[1.6]"
            >
              Most AI systems work in controlled demos or sandbox environments. The real challenge begins when
              unpredictable conditions, network limitations, and safety expectations collide. We unpack what
              reliability truly means and why it's the hidden backbone of intelligent devices.
            </p>

            {/* Button */}
            <div ref={buttonRef}>
             <CTAbutton
              href="/blogs-detail"
              text="Read More"              
            />      
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WhyReliability;