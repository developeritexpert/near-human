"use client";

import { useEffect, useRef, useState } from "react";

function ImageSec() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!iframeRef.current?.contentWindow) return;

        if (entry.isIntersecting) {
          iframeRef.current.contentWindow.postMessage(
            '{"event":"command","func":"playVideo","args":""}',
            "*"
          );
        } else {
          iframeRef.current.contentWindow.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            "*"
          );
        }
      },
      { threshold: 0.6 } // 60% visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="px-[20px] md:px-[30px] lg:px-[50px] relative
      after:absolute after:top-[217px] after:left-0 after:h-[974px] after:w-full
      after:content-[''] after:-z-1
      after:bg-[url('/img/scooter-bgimg.png')] after:bg-cover after:bg-center after:no-repeat">

       <div ref={containerRef} className="w-full">
      <div className="relative overflow-hidden h-[60vh] sm:h-[70vh] md:h-[90vh] rounded-[15px] md:rounded-[30px]">

  {/* 🔹 Background Image (Acts as a placeholder/cover) */}
  <img
    src="/img/Sctr-img-sec.png"
    alt="Scooter"
    className="absolute inset-0 w-full h-full object-cover -z-10"
  />

  {/* 🔹 Video (Persistent iframe) */}
    <iframe
      ref={iframeRef}
      className="absolute inset-0 w-full h-full object-cover"
      src="https://www.youtube.com/embed/6-AjSG7Zw_4?enablejsapi=1&autoplay=0&mute=1&controls=1&rel=0"
      title="YouTube video player"
      allow="autoplay; encrypted-media"
      allowFullScreen
    />

</div>
    </div>
    </section>
  );
}

export default ImageSec;
