"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Protocol = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".protocol-reveal", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
        opacity: 0,
        y: 40,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Animate the perspective grid
      gsap.to(".perspective-grid", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        rotateX: 60,
        y: -50,
        ease: "none",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="notched-section notched-top notched-bottom relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-black perspective-[1000px]"
    >
      {/* Perspective Grid Visual */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="perspective-grid h-[200%] w-[200%] translate-y-[20%] rotate-x-[45deg] bg-[linear-gradient(to_right,#00ffcc22_1px,transparent_1px),linear-gradient(to_bottom,#00ffcc22_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />
      </div>

      {/* Decorative vertical light beam */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#00ffcc11_0%,_transparent_70%)]" />

      <div
        ref={containerRef}
        className="container-custom relative z-10 text-center"
      >
        <span className="protocol-reveal mb-10 block translate-y-0 text-[10px] font-medium tracking-[0.6em] text-white/50 uppercase opacity-1">
          That's the
        </span>
        <h2 className="protocol-reveal mb-12 text-[6vw]  lg:text-[80px] xl:text-[110px] leading-[1.1] font-bold tracking-tighter text-white ">
          Model to Device Protocol
        </h2>

        {/* Glow effect under text */}
        <div className="bg-primary/10 absolute top-1/2 left-1/2 -z-10 h-[50vh] w-full -translate-x-1/2 -translate-y-1/2 blur-[120px]" />
      </div>
    </section>
  );
};

export default Protocol;
