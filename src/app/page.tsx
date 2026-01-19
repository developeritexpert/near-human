// // "use client";

// import { useEffect } from "react";
// import Lenis from "@studio-freight/lenis";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import Hero from "@/components/sections/home/Hero";
// import AIStandard from "@/components/sections/home/AIStandard";
// import AIDevices from "@/components/sections/home/AIDevices";
// import Protocol from "@/components/sections/home/Protocol";
// import Journey from "@/components/sections/home/Journey";
// import Partners from "@/components/sections/home/Partners";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { gsap } from "gsap";

// export default function Home() {
// useEffect(() => {
//   const lenis = new Lenis({
//     duration: 1.2,
//     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//     smoothWheel: true,
//   });

//   lenis.on("scroll", ScrollTrigger.update);

//   gsap.ticker.add((time) => {
//     lenis.raf(time * 1000);
//   });

//   gsap.ticker.lagSmoothing(0);

//   return () => {
//     gsap.ticker.remove(lenis.raf);
//     lenis.destroy();
//   };
// }, []);

// //   return (
// //     <main className="selection:bg-primary relative min-h-screen overflow-hidden bg-black selection:text-black">
// //       <Navbar />

// //       <div className="">
// //         <Hero />
// //         {/* <AIStandard /> */}
// //         <AIDevices />
// //         {/* White spacer to prevent black screen after AIDevices unpins */}
// //         <div className="min-h-[200vh] bg-white" />
// //         {/* <Protocol />
// //         <Journey />
// //         <Partners /> */}
// //       </div>

// //       <Footer />

// //       {/* Global Grainy Overlay (Subtle) */}
// //       <div className="pointer-events-none fixed inset-0 z-[999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
// //     </main>
// //   );
// // }

// //------new
// import Footer from '@/components/layout/Footer'
// import Navbar from '@/components/layout/Navbar'
// // import DeviceProtocol from '@/components/sections/home/DeviceProtocol'
// // import EcoSystem from '@/components/sections/home/EcoSystem'
// // import HomeBanner from '@/components/sections/home/HomeBanner'
// // import OurJourney from '@/components/sections/home/Our-Journey'
// // import OurPartners from '@/components/sections/home/OurPartners'
// // import Posibilities from '@/components/sections/home/Posibilities'
// // import LoaderWrapper from '@/components/loader/LoaderWrapper';
// import React from 'react'

// function page() {
//   return (
//     <main className="selection:bg-primary relative min-h-screen overflow-hidden bg-black selection:text-black">
//       <Navbar />

//       <div className="">
//         <Hero />
//         <AIStandard />
//         {/* <AIDevices /> */}
//         {/* White spacer to prevent black screen after AIDevices unpins */}
//         {/* <div className="min-h-[200vh] bg-white" /> */}

//         {/* <Protocol />
//         <Journey />
//         <Partners /> */}
//       </div>

//       <Footer />

//       {/* Global Grainy Overlay (Subtle) */}
//       <div className="pointer-events-none fixed inset-0 z-[999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
//     </main>
//   );
// }

// export default page;

"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/home/Hero";
import AIStandard from "@/components/sections/home/AIStandard";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import DeviceProtocol from "@/components/sections/home/DeviceProtocol";
import EcoSystem from "@/components/sections/home/EcoSystem";
import HomeBanner from "@/components/sections/home/HomeBanner";
import OurJourney from "@/components/sections/home/Our-Journey";
import OurPartners from "@/components/sections/home/OurPartners";
import Posibilities from "@/components/sections/home/Posibilities";
import React from "react";

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // // Set black background immediately
    // document.body.style.backgroundColor = '#000000';
    // document.documentElement.style.backgroundColor = '#000000';

    // Enhanced Lenis configuration
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      // smoothTouch: false, // Better mobile performance
      touchMultiplier: 2,
      infinite: false,
      autoResize: true,
    });

    lenisRef.current = lenis;

    // Sync with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Animation frame loop
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    // Handle window resize
    const handleResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    // GSAP ticker configuration
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      window.removeEventListener("resize", handleResize);
      lenisRef.current = null;
    };
  }, []);

  return (
    <>
      <LoaderWrapper>
        <Navbar />
        <div className="overflow-x-hidden">
          <Hero />
          <div className="relative">
            <Posibilities />
            <DeviceProtocol />
            <OurJourney />
            <OurPartners />
            <EcoSystem />
          </div>
          {/* <AIStandard /> */}
        </div>
        <Footer />

        {/* Global Grainy Overlay */}

        <div className="pointer-events-none fixed inset-0 z-[999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </LoaderWrapper>
    </>
  );
}

// function page() {
//   return (
//     <div>
//       <Navbar/>
//       <HomeBanner/>
//       <Posibilities/>
//       <DeviceProtocol/>
//       <OurJourney/>
//       <OurPartners/>
//       <EcoSystem/>
//       <Footer/>
//     </div>
//   )
// }
