"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function ScootrrSec() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const tagRef = useRef<HTMLHeadingElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const lineRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      })
        .from(tagRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        })
        .from(lineRef.current, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.6,
          ease: "power3.out",
        }, "-=0.3")
        .from(headingRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        }, "-=0.3");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-[20px] md:px-[30px] lg:px-[50px]
      pb-[40px] md:pb-[70px] lg:pb-[90px]
      pt-[140px] md:pt-[170px] lg:pt-[200px] xl:pt-[260px] xl:pb-[134px]"
    >
      <div className="container max-w-[1440px] mx-auto text-center">

        {/* Top Tag */}
        {/* <h5
          ref={tagRef}
          className="text-[24px] font-[450] tracking-wide text-[#10171738]"
        >
          Scootrr
        </h5> */}

        {/* Accent Line */}
        {/* <span
          ref={lineRef}
          className="block mx-auto mt-[14px] mb-[24px] h-[2px] w-[90px]
          bg-[#00B0B2]"
        /> */}

        {/* Main Heading */}
        <h3
          ref={headingRef}
          className="text-[28px] md:text-[45px] lg:text-[57px]
          text-[#101717] font-[450]
          max-w-[950px] mx-auto leading-[1.2]"
        >
          Scootrr is the safety intelligence for{" "}
          <span className="text-[#00B0B2]">
            e-scooters, e-bikes
          </span>{" "}
          and other micromobility vehicles.
        </h3>

      </div>
    </section>
  );
}

export default ScootrrSec;
