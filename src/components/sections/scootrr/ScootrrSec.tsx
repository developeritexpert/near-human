"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

function ScootrrSec() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const [topSpacing, setTopSpacing] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const calculateTopSpace = () => {
      const screenHeight = window.innerHeight;
      const mobile =
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
        window.innerWidth < 768;

      setIsMobile(mobile);

      if (!mobile) {
        // DESKTOP: Dynamic calculation
        const initialMaskHeight = screenHeight * 0.7;
        const topSpace = (screenHeight - initialMaskHeight) / 2;
        setTopSpacing(topSpace);
      }
    };

    calculateTopSpace();

    window.addEventListener("resize", calculateTopSpace);
    return () => window.removeEventListener("resize", calculateTopSpace);
  }, []);

  useEffect(() => {
    if (!headingRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex items-center justify-center px-[20px] pb-[100px] md:px-[30px] md:pb-[50px] lg:px-[50px]"
      style={{
        paddingTop: isMobile
          ? "201px"
          : topSpacing > 0
            ? `${topSpacing + 158}px`
            : undefined,
      }}
    >
      <div className="container mx-auto max-w-[1440px] text-center">
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
