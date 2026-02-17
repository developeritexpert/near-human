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
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    ScrollTrigger.clearMatchMedia();

    window.scrollTo(0, 0);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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

      if (isMobile) {
        // On mobile: use scrollerProxy so ScrollTrigger reads Lenis's virtual
        // scroll position instead of window.scrollY. This fixes the pin
        // coordinate mismatch that causes sections to replay after unpinning.
        ScrollTrigger.scrollerProxy(document.body, {
          scrollTop(value) {
            if (arguments.length && value !== undefined) {
              lenis.scrollTo(value, { immediate: true, force: true });
            }
            return lenis.scroll;
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            };
          },
          pinType: "transform",
        });

        lenis.on("scroll", ScrollTrigger.update);

        // Drive Lenis with rAF on mobile for reliable touch frame timing
        function raf(time: number) {
          lenis.raf(time);
          rafRef.current = requestAnimationFrame(raf);
        }
        rafRef.current = requestAnimationFrame(raf);
      } else {
        // Desktop: original integration — gsap.ticker drives Lenis
        lenis.on("scroll", ScrollTrigger.update);

        const tickerFn = (time: number) => {
          lenis.raf(time * 1000);
        };
        tickerFnRef.current = tickerFn;
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);
      }

      const refreshTimeout = setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh(true);
      }, 300);

      const handleResize = () => {
        lenis.resize();
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

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
        tickerFnRef.current = null;
      }

      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }

      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        ScrollTrigger.scrollerProxy(document.body, undefined as any);
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
