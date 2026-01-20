// components/loader/RouteLoaderWrapper.tsx
"use client";

import { useState, useEffect } from "react";
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
  }, []);

  const handleLoadComplete = () => {
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {loading && <RouteLoader onComplete={handleLoadComplete} />}
      <div className="min-h-screen">{children}</div>
    </>
  );
}