"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Partners = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".partner-box", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="notched-section notched-top bg-white px-8 py-40"
    >
      <div className="container-custom">
        <h2 className="mb-32 text-center text-4xl font-bold tracking-tighter text-black md:text-6xl">
          Our Partners
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {[
            { name: "Product", icon: "▢" },
            { name: "Invert", icon: "⊙" },
            { name: "SnapShot", icon: "◎" },
          ].map((partner, index) => (
            <div
              key={partner.name}
              className={`partner-box relative flex aspect-video items-center justify-center border-zinc-100 ${
                index !== 2 ? "md:border-r" : ""
              } group cursor-pointer transition-all duration-700 hover:bg-zinc-50`}
            >
              {/* Plus icons at corners */}
              <div className="absolute -top-2 -right-2 text-xl font-light text-zinc-300 select-none">
                +
              </div>
              <div className="absolute -bottom-2 -left-2 text-xl font-light text-zinc-300 select-none">
                +
              </div>

              <div className="flex items-center gap-4 text-zinc-400 transition-colors duration-500 group-hover:text-black">
                <span className="text-4xl font-light opacity-50">
                  {partner.icon}
                </span>
                <span className="text-2xl font-black tracking-tighter uppercase">
                  {partner.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
