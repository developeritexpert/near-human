"use client";

import { useEffect, useRef } from "react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import BannerResouraces from "@/components/sections/blogs/BannerResouraces";
import BlogGridSec from "@/components/sections/blogs/BlogGridSec";
import LatestNewsSlider from "@/components/sections/blogs/LatestNewsSlider";
import WhatsNear from "@/components/sections/blogs/WhatsNear";
import WhyReliability from "@/components/sections/blogs/WhyReliability";
import YourInsights from "@/components/sections/blogs/YourInsights";
import React from "react";
import RouteLoaderWrapper from "@/components/loader/RouteLoaderWrapper";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function Page() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Kill all existing ScrollTriggers first
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

      // Add Lenis to GSAP ticker
      const tickerCallback = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      // Refresh ScrollTrigger after Lenis is ready
      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 300);

      const handleResize = () => {
        lenis.resize();
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", handleResize);

      // Store cleanup references
      (window as any).__lenisCleanup = {
        refreshTimeout,
        handleResize,
        tickerCallback,
      };
    }, 100);

    return () => {
      clearTimeout(initTimeout);

      // Get cleanup references
      const cleanup = (window as any).__lenisCleanup;

      if (cleanup) {
        clearTimeout(cleanup.refreshTimeout);
        window.removeEventListener("resize", cleanup.handleResize);
        gsap.ticker.remove(cleanup.tickerCallback);
        delete (window as any).__lenisCleanup;
      }

      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }

      // Clean up all ScrollTriggers on unmount
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div>
      <RouteLoaderWrapper>
        <Navbar />
        <BannerResouraces />
        <LatestNewsSlider />
        <WhyReliability />
        <BlogGridSec />
        <YourInsights />
        <WhatsNear />
        <Footer />
      </RouteLoaderWrapper>
    </div>
  );
}

export default Page;