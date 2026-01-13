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

export default function Home() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="selection:bg-primary relative min-h-screen overflow-hidden bg-black selection:text-black">
      <Navbar />

      <div className="">
        <Hero />
        {/* <AIStandard /> */}
        <AIDevices />
        {/* White spacer to prevent black screen after AIDevices unpins */}
        <div className="min-h-[200vh] bg-white" />
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
