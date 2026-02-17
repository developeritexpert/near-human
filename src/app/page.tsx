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

    // ─── INIT ORDER EXPLANATION ─────────────────────────────────────────────────
    // Child components (SideVideo, TinyComputerVision) set isReady at 50ms →
    // their useEffect fires → ScrollTrigger.create(pin:true) inserts pin-spacer
    // divs into the DOM, making the page significantly taller.
    //
    // THE BUG: If Lenis inits before pin spacers exist, it reads a short
    // scrollHeight and caches a small scroll limit. Once pin spacers appear,
    // the real page is much taller than Lenis knows. Lenis virtual scroll
    // hits its cached limit and stops — but the user's finger keeps moving,
    // so the browser's native scroll takes over. Result: the user scrolls
    // through the pinned section once in Lenis's world, then the same section
    // appears again as native scroll catches up. This is the "shows same
    // section again" bug.
    //
    // THE FIX: Lenis inits at 200ms — after all child pin spacers are inserted.
    // ScrollTrigger.normalizeScroll(true) then permanently suppresses native
    // scroll so it can never take over, even if Lenis's limit is briefly stale.
    // ────────────────────────────────────────────────────────────────────────────
    const initTimeout = setTimeout(() => {
      const lenis = new Lenis({
        duration: isMobile ? 0.8 : 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: isMobile ? 1 : 2,
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

      // Permanently suppress native scroll events so the browser can never
      // "take over" from Lenis mid-scroll through a pinned section.
      // This is the direct kill-switch for the double-scroll replay bug.
      ScrollTrigger.normalizeScroll(true);

      // lenis.resize() forces a fresh read of the real (post-pin-spacer)
      // scrollHeight so Lenis's virtual scroll limit is accurate.
      // ScrollTrigger.refresh(true) recalculates all trigger start/end
      // positions with Lenis now active.
      const refreshTimeout = setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh(true);
      }, 100);

      const handleResize = () => {
        lenis.resize();
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        clearTimeout(refreshTimeout);
        window.removeEventListener("resize", handleResize);
      };
    }, 200); // ← must be > child isReady timers (50ms) + one render cycle (~16ms)

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
