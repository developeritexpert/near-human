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
    // Kill all existing ScrollTriggers before re-initializing
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    ScrollTrigger.clearMatchMedia();

    window.scrollTo(0, 0);

    // Detect mobile once so we can tune Lenis accordingly
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const initTimeout = setTimeout(() => {
      const lenis = new Lenis({
        duration: isMobile ? 0.8 : 1.2, // shorter duration on mobile reduces overshoot
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        // FIX 1: Lower touchMultiplier — default 2 causes scrub overshoot on mobile
        // which makes pinned sections lag/flicker during touch scroll
        touchMultiplier: isMobile ? 1 : 2,
        infinite: false,
        autoResize: true,
      });

      lenisRef.current = lenis;

      // Wire Lenis scroll events to ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      const tickerFn = (time: number) => {
        lenis.raf(time * 1000);
      };
      tickerFnRef.current = tickerFn;
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);

      // FIX 2: Use a longer refresh delay (800ms) to ensure ALL child components
      // have finished their own isReady timers (100ms in SideVideo, 500ms in TinyComputerVision)
      // before we do the final position refresh. This eliminates the race condition
      // that causes "normal → sudden jump → pin" on first scroll and reverse scroll.
      const refreshTimeout = setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh(true);
      }, 800);

      const handleResize = () => {
        lenis.resize();
        // Brief debounce on resize prevents thrashing
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        clearTimeout(refreshTimeout);
        window.removeEventListener("resize", handleResize);
      };
    }, 100);

    return () => {
      clearTimeout(initTimeout);

      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
        tickerFnRef.current = null;
      }

      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }

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
