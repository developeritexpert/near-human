"use client";

import { useState, useEffect } from "react";
import CinematicLoader from "./CinematicLoader";

export default function LoaderWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoadComplete = () => {
    setLoading(false);
  };

  if (!mounted) return null;

  return (
    <>
      {loading && <CinematicLoader onComplete={handleLoadComplete} />}
      <div style={{ opacity: loading ? 0 : 1, transition: "opacity 0.3s" }}>
        {children}
      </div>
    </>
  );
}