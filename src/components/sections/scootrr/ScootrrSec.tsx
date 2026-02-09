"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

function ScootrrSec() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (!headingRef.current) return;

    const ctx = gsap.context(() => {
      // Animate immediately on page load, no ScrollTrigger needed
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.2, // Small delay for smoother page load
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []); // Empty dependency array - run once on mount

  return (
    <section
      ref={sectionRef}
      className="flex items-center justify-center px-[20px] pt-[140px] pb-[40px] md:px-[30px] md:pt-[170px] md:pb-[70px] lg:px-[50px] lg:pt-[349px] lg:pb-[44px] xl:pt-[369px] xl:pb-[24px]"
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
