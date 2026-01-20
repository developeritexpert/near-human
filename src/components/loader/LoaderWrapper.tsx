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

  useEffect(() => {
    setMounted(true);

    // Force scroll to top and block scrolling
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    
    // Set black background to prevent white flash
    document.body.style.backgroundColor = "#000000";
    document.documentElement.style.backgroundColor = "#000000";
  }, []);

  const handleLoadComplete = useCallback(() => {
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setShowLoader(false);

      // Re-enable scrolling
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";

      window.scrollTo(0, 0);

      // Refresh ScrollTrigger
      setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 100);
    }, 50);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{  minHeight: "100vh" }}>
      {showLoader && <CinematicLoader onComplete={handleLoadComplete} />}

      <div
       
        className="min-h-screen"
      >
        {children}
      </div>
    </div>
  );
}