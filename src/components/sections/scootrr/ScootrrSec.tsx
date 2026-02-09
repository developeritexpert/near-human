"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

function ScootrrSec() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const [topSpacing, setTopSpacing] = useState(0);

  useEffect(() => {
    // Calculate the mask top space
    const calculateTopSpace = () => {
      const screenHeight = window.innerHeight;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      // Calculate initial mask height (same logic as ImageSec)
      const initialMaskHeight = isMobile
        ? screenHeight * 0.7
        : screenHeight * 0.7;

      // Calculate top space: (screen height - initial mask height) / 2
      const topSpace = (screenHeight - initialMaskHeight) / 2;

      setTopSpacing(topSpace);
    };

    calculateTopSpace();

    // Recalculate on resize
    window.addEventListener("resize", calculateTopSpace);
    return () => window.removeEventListener("resize", calculateTopSpace);
  }, []);

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
      className="flex items-center justify-center px-[20px] pb-[50px] md:px-[30px] lg:px-[50px]"
      style={{
        paddingTop: topSpacing > 0 ? `${topSpacing + 158}px` : undefined,
      }}
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
