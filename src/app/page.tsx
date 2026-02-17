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
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    ScrollTrigger.clearMatchMedia();

    window.scrollTo(0, 0);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const initTimeout = setTimeout(() => {
      if (!isMobile) {
        // ── DESKTOP ONLY: original Lenis smooth scroll ──────────────────────
        // Desktop is perfect as-is. Lenis + gsap.ticker is the correct
        // integration for mouse wheel. No changes from your original.
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
        lenis.on("scroll", ScrollTrigger.update);

        const tickerFn = (time: number) => {
          lenis.raf(time * 1000);
        };
        tickerFnRef.current = tickerFn;
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);

        const refreshTimeout = setTimeout(() => {
          lenis.resize();
          ScrollTrigger.refresh(true);
        }, 600);

        const handleResize = () => {
          lenis.resize();
          ScrollTrigger.refresh();
        };

        window.addEventListener("resize", handleResize);

        return () => {
          clearTimeout(refreshTimeout);
          window.removeEventListener("resize", handleResize);
        };
      } else {
        // ── MOBILE: no Lenis, native scroll only ────────────────────────────
        // Mobile browsers have built-in momentum/inertia scroll — Lenis adds
        // nothing useful on touch and actively breaks ScrollTrigger pins by
        // creating a virtual scroll coordinate that diverges from the native
        // window.scrollY that ScrollTrigger uses for pin spacer positions.
        // Without Lenis, ScrollTrigger reads native scroll directly and pins
        // fire at exactly the right position with no replay, no white space.
        //
        // ScrollTrigger.normalizeScroll fixes iOS Safari's "bouncy" overscroll
        // and the address bar resize that shifts trigger positions mid-scroll.
        ScrollTrigger.normalizeScroll(true);

        const refreshTimeout = setTimeout(() => {
          ScrollTrigger.refresh(true);
        }, 600);

        const handleResize = () => {
          ScrollTrigger.refresh();
        };

        window.addEventListener("resize", handleResize);

        return () => {
          clearTimeout(refreshTimeout);
          window.removeEventListener("resize", handleResize);
        };
      }
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

      ScrollTrigger.normalizeScroll(false);
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
