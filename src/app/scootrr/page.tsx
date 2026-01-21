// app/scootr/page.tsx - FIXED VERSION
"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap, ScrollTrigger, registerGSAP, killAllScrollTriggers } from "@/lib/gsap";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import DropMessage from "@/components/sections/scootrr/DropMessage";
import ImageSec from "@/components/sections/scootrr/ImageSec";
import ScootrrSec from "@/components/sections/scootrr/ScootrrSec";
import SideVideo from "@/components/sections/scootrr/SideVideo";
import TinyComputerVision from "@/components/sections/scootrr/TinyComputerVision";
import VehicleTechStack from "@/components/sections/scootrr/VehicleTechStack";
import RouteLoaderWrapper from "@/components/loader/RouteLoaderWrapper";

export default function ScootrPage() {
  const lenisRef = useRef<Lenis | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Register GSAP plugins globally
    registerGSAP();

    // Kill all existing ScrollTriggers
    killAllScrollTriggers();

    // Small delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      // Initialize Lenis
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

      // Sync Lenis with ScrollTrigger
      lenis.on("scroll", () => {
        ScrollTrigger.update();
      });

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);

      // Refresh ScrollTrigger after initialization
      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      return () => clearTimeout(refreshTimer);
    }, 100);

    return () => {
      clearTimeout(initTimer);
      
      // Cleanup
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      
      gsap.ticker.remove((time) => {
        lenisRef.current?.raf(time * 1000);
      });

      // Kill all ScrollTriggers on unmount
      killAllScrollTriggers();
      
      isInitialized.current = false;
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
        <VehicleTechStack />
        <DropMessage />
      </main>
      <Footer />
      
      {/* Grainy Overlay */}
      <div className="pointer-events-none fixed inset-0 z-[999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
    </RouteLoaderWrapper>
  );
}