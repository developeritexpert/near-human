"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function ScootrrSec() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const tagRef = useRef<HTMLHeadingElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const lineRef = useRef<HTMLSpanElement | null>(null);
  const [startPoint, setStartPoint] = useState("top 75%");

  useEffect(() => {
    // Set start point based on screen size
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setStartPoint("top 30%"); // Mobile
      } else if (window.innerWidth < 1024) {
        setStartPoint("top 50%"); // Tablet
      } else {
        setStartPoint("top 75%"); // Desktop
      }
    };

    // Initial check
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: startPoint, // Dynamic start point
          },
        })
        .from(tagRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        })
        .from(
          lineRef.current,
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .from(
          headingRef.current,
          {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [startPoint]); // Re-run when startPoint changes

  return (
    <section
      ref={sectionRef}
      className="flex min-h-[calc(100vh-125px)] items-center justify-center px-[20px] pt-[140px] pb-[40px] md:px-[30px] md:pt-[170px] md:pb-[70px] lg:px-[50px] lg:pt-[200px] lg:pb-[90px] xl:pt-[260px] xl:pb-[134px]"
    >
      <div className="container mx-auto max-w-[1440px] text-center">
        {/* Main Heading */}
        <h3
          ref={headingRef}
          className="mx-auto max-w-[950px] text-[28px] leading-[1.2] font-[450] text-[#101717] md:text-[45px] lg:text-[57px]"
        >
          Scootrr is the safety intelligence for{" "}
          <span className="text-[#00B0B2]">e-scooters, e-bikes</span> and other
          micromobility vehicles.
        </h3>
      </div>
    </section>
  );
}

export default ScootrrSec;
