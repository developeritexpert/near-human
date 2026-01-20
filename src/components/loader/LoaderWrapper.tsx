// components/loader/LoaderWrapper.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import CinematicLoader from "./CinematicLoader";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LoaderWrapper({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Force scroll to top and block scrolling
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = "0";
  }, []);

  const handleLoadComplete = useCallback(() => {
    // Keep scroll blocked until content is ready
    setTimeout(() => {
      setShowLoader(false);

      // Allow scrolling after a delay
      setTimeout(() => {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.top = "";

        window.scrollTo(0, 0);
        setContentReady(true);

        // Refresh ScrollTrigger
        setTimeout(() => {
          ScrollTrigger.refresh(true);
        }, 100);
      }, 300);
    }, 100);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {showLoader && <CinematicLoader onComplete={handleLoadComplete} />}

      <div
        style={{
          opacity: contentReady ? 1 : 0,
          visibility: showLoader ? "hidden" : "visible",
          transition: "opacity 0.5s ease-in-out",
        }}
        className="min-h-screen"
      >
        {children}
      </div>
    </>
  );
}