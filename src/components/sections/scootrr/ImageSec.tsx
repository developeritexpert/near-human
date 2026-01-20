"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

function ImageSec() {
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imageWrapperRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      const wrapper = imageWrapperRef.current!;
      const img = imageRef.current!;

      // Hover In
      wrapper.addEventListener("mouseenter", () => {
        gsap.to(img, {
          scale: 1.08,
          duration: 0.6,
          ease: "power3.out",
        });

        gsap.to(wrapper, {
          boxShadow: "0px 40px 80px rgba(0,0,0,0.35)",
          duration: 0.6,
          ease: "power3.out",
        });
      });

      // Hover Out
      wrapper.addEventListener("mouseleave", () => {
        gsap.to([img, wrapper], {
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          boxShadow: "0px 0px 0px rgba(0,0,0,0)",
          duration: 0.6,
          ease: "power3.out",
        });
      });

      // Mouse Move (3D Tilt Effect)
      wrapper.addEventListener("mousemove", (e: MouseEvent) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = gsap.utils.mapRange(0, rect.width, -8, 8, x);
        const rotateX = gsap.utils.mapRange(0, rect.height, 8, -8, y);

        gsap.to(wrapper, {
          rotateX,
          rotateY,
          transformPerspective: 800,
          duration: 0.4,
          ease: "power2.out",
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="px-[20px] md:px-[30px] lg:px-[50px] relative
      after:absolute after:top-[217px] after:left-0 after:h-[974px] after:w-full
      after:content-[''] after:-z-1
      after:bg-[url('/img/scooter-bgimg.png')] after:bg-cover after:bg-center after:no-repeat">

      <div className="container max-w-[1440px] mx-auto">
        <div
          ref={imageWrapperRef}
          className="rounded-[15px] md:rounded-[30px] overflow-hidden will-change-transform cursor-pointer"
        >
          <img
            ref={imageRef}
            src="/img/Sctr-img-sec.png"
            alt="Scooter"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default ImageSec;
