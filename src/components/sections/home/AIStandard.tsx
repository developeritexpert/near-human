"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AIStandard = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".standard-text-line", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex flex-col items-center justify-center bg-white px-8 py-32 text-center"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-4xl leading-none font-bold tracking-tight md:text-6xl">
          <span className="standard-text-line mb-2 block px-6 text-black">
            Today, AI has <span className="text-[#00B0B2]">no standard</span>
          </span>
          <span className="standard-text-line block text-zinc-700">
            way to talk <span className="text-zinc-700">to the hardware</span>
          </span>
          <span className="standard-text-line block text-zinc-700">
            devices
          </span>
        </h2>
      </div>
    </section>
  );
};

export default AIStandard;
