// components/loader/LoaderWrapper.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import CinematicLoader from "./CinematicLoader";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { heroState } from "@/components/sections/home/Hero";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LoaderWrapper({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const loaderFinishedRef = useRef(false);

  useEffect(() => {
    setMounted(true);

    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.backgroundColor = "#000000";
    document.documentElement.style.backgroundColor = "#000000";

    // Listen for Hero images to finish loading
    heroState.onLoadComplete = () => {
      setHeroReady(true);
    };

    // Check if already loaded
    if (heroState.isLoaded) {
      setHeroReady(true);
    }

    return () => {
      heroState.onLoadComplete = null;
    };
  }, []);

  // Only complete when both loader animation finished AND hero images loaded
  useEffect(() => {
    if (loaderFinishedRef.current && heroReady) {
      finalizeLoading();
    }
  }, [heroReady]);

  const finalizeLoading = useCallback(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    window.scrollTo(0, 0);

    setShowLoader(false);

    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 100);
  }, []);

  const handleLoaderAnimationComplete = useCallback(() => {
    loaderFinishedRef.current = true;

    // If hero already loaded, finalize immediately
    if (heroReady) {
      finalizeLoading();
    }
    // Otherwise wait for heroReady to become true
  }, [heroReady, finalizeLoading]);

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      {showLoader && <CinematicLoader onComplete={handleLoaderAnimationComplete} />}

      <div
        style={{
          opacity: showLoader ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
          backgroundColor: "#000000",
        }}
        className="min-h-screen"
      >
        {children}
      </div>
    </div>
  );
}