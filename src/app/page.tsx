"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import EcoSystem from "@/components/sections/home/EcoSystem";
import OurPartners from "@/components/sections/home/OurPartners";
import DropMessage from "@/components/sections/scootrr/DropMessage";
import ImageSec from "@/components/sections/scootrr/ImageSec";
import ScootrrSec from "@/components/sections/scootrr/ScootrrSec";
import SideVideo from "@/components/sections/scootrr/SideVideo";
import TinyComputerVision from "@/components/sections/scootrr/TinyComputerVision";
import RouteLoaderWrapper from "@/components/loader/RouteLoaderWrapper";

gsap.registerPlugin(ScrollTrigger);

export default function ScootrPage() {
  const lenisRef = useRef<Lenis | null>(null);
  const tickerFnRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    // CRITICAL: Kill ALL ScrollTriggers first to prevent conflicts
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    ScrollTrigger.clearMatchMedia();

    // Reset scroll position
    window.scrollTo(0, 0);

    // Small delay to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
        autoResize: true,
      });

      lenisRef.current = lenis;

      // Connect Lenis to ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      // CRITICAL: Create ticker function and store reference for proper cleanup
      const tickerFn = (time: number) => {
        lenis.raf(time * 1000);
      };
      tickerFnRef.current = tickerFn;

      // Add to GSAP ticker
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);

      // CRITICAL: Longer delay to ensure all child components have registered their ScrollTriggers
      // This prevents race conditions where ScrollTrigger.refresh() runs before all triggers are created
      const refreshTimeout = setTimeout(() => {
        if (lenisRef.current) lenisRef.current.resize();
        ScrollTrigger.refresh(true);
      }, 800);

      const handleResize = () => {
        if (lenisRef.current) lenisRef.current.resize();
        // Add small delay before refresh to prevent race conditions
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        clearTimeout(refreshTimeout);
        window.removeEventListener("resize", handleResize);
      };
    }, 100);

    return () => {
      clearTimeout(initTimeout);

      // CRITICAL: Remove ticker function using the stored reference
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
        tickerFnRef.current = null;
      }

      // Destroy Lenis
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }

      // CRITICAL: Kill all ScrollTriggers on cleanup to prevent conflicts on remount
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <RouteLoaderWrapper>
      <Navbar />
      <main className="overflow-x-hidden">
        <ScootrrSec />
        <ImageSec />
        <SideVideo />
        <TinyComputerVision />
        <OurPartners />
        <DropMessage />
      </main>
      <Footer />

      <div className="pointer-events-none fixed inset-0 z-[999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
    </RouteLoaderWrapper>
  );
}
