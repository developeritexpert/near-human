"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/home/Hero";
import AIStandard from "@/components/sections/home/AIStandard";
import AIDevices from "@/components/sections/home/AIDevices";
import Protocol from "@/components/sections/home/Protocol";
import Journey from "@/components/sections/home/Journey";
import Partners from "@/components/sections/home/Partners";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

export default function Home() {
useEffect(() => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(lenis.raf);
    lenis.destroy();
  };
}, []);


  return (
    <main className="selection:bg-primary relative min-h-screen overflow-hidden bg-black selection:text-black">
      <Navbar />

      <div className="">
        <Hero />
        <AIStandard />
        {/* <AIDevices /> */}
        {/* White spacer to prevent black screen after AIDevices unpins */}
        {/* <div className="min-h-[200vh] bg-white" /> */}
        
        {/* <Protocol />
        <Journey />
        <Partners /> */}
      </div>

      <Footer />

      {/* Global Grainy Overlay (Subtle) */}
      <div className="pointer-events-none fixed inset-0 z-[999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
    </main>
  );
}
