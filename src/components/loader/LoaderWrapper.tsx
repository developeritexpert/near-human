"use client";

import { useState, useEffect } from "react";
import CinematicLoader from "./CinematicLoader";

export default function LoaderWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Force black background
    // document.body.style.backgroundColor = '#000000';
    // document.documentElement.style.backgroundColor = '#000000';
  }, []);

  const handleLoadComplete = () => {
    // Wait a bit longer to ensure hero is ready
    setTimeout(() => {
      setLoading(false);
    }, 200);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {loading && <CinematicLoader onComplete={handleLoadComplete} />}
      
      {/* Always render but keep hidden until ready */}
      <div 
        
        className="min-h-screen"
      >
        {children}
      </div>
    </>
  );
}