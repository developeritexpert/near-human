"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Journey = () => {
  const [activeTab, setActiveTab] = useState("Hub");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".journey-reveal", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white px-8 py-40">
      <div className="container-custom text-center">
        <h2 className="journey-reveal mb-12 text-3xl font-medium tracking-tight text-black md:text-5xl">
          Our journey started with <span className="font-bold">Scootrr</span>,
          <br />
          solving real world challenges
        </h2>

        <div className="journey-reveal mx-auto mt-20 mb-20 flex max-w-fit flex-wrap items-center justify-center gap-2 rounded-full border border-zinc-100 bg-zinc-50 p-2">
          {["Hub", "Asset", "Contacts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-10 py-3 text-[10px] font-bold tracking-widest uppercase transition-all duration-500 ${
                activeTab === tab
                  ? "bg-primary text-black shadow-[0_4px_20px_rgba(0,235,202,0.3)]"
                  : "bg-transparent text-zinc-400 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Visual Content Placeholder to match the image spacing */}
        <div className="journey-reveal relative flex h-[60vh] w-full items-center justify-center overflow-hidden rounded-[48px] bg-[#050505] md:h-[70vh]">
          <div className="absolute inset-0 p-px">
            <div className="relative h-full w-full overflow-hidden rounded-[47px] border border-white/5 bg-[#0a0a0a]">
              {/* Glowing decorative lines */}
              <div className="via-primary/20 absolute top-1/2 left-1/2 h-px w-[80%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent to-transparent" />
              <div className="via-primary/20 absolute top-1/2 left-1/2 h-[80%] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent to-transparent" />

              <h3 className="text-[12vw] font-black tracking-tighter text-white uppercase italic opacity-[0.02] select-none">
                {activeTab}
              </h3>
            </div>
          </div>

          {/* Corner plus icons simulation */}
          <div className="text-primary absolute top-12 left-12 opacity-40">
            +
          </div>
          <div className="text-primary absolute top-12 right-12 opacity-40">
            +
          </div>
          <div className="text-primary absolute bottom-12 left-12 opacity-40">
            +
          </div>
          <div className="text-primary absolute right-12 bottom-12 opacity-40">
            +
          </div>
        </div>
      </div>
    </section>
  );
};

export default Journey;
