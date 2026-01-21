"use client";

import { useState, useEffect, useCallback } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RouteLoader from "./RouteLoader";

export default function RouteLoaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Clear any stale ScrollTriggers on mount
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleLoadComplete = useCallback(() => {
    // Add a small delay and refresh ScrollTrigger
    setTimeout(() => {
      setLoading(false);
      
      // Refresh after content is visible
      requestAnimationFrame(() => {
        ScrollTrigger.refresh(true);
      });
    }, 150);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {loading && <RouteLoader onComplete={handleLoadComplete} />}
      <div 
        className="min-h-screen"
        style={{ visibility: loading ? 'hidden' : 'visible' }}
      >
        {children}
      </div>
    </>
  );
}