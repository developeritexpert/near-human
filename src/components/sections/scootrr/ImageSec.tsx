"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ImageSec() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    /* ===============================
       WIDTH INCREASE (SMOOTH)
    =============================== */
    gsap.fromTo(
      containerRef.current,
      { width: "50%" },
      {
        width: "100%",
        ease: "none",                // ✅ MOST IMPORTANT
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",          // early start
          end: "bottom 20%",         // long scroll distance
          scrub: 3,                  // ✅ MORE = SMOOTHER
          anticipatePin: 1
        }
      }
    );

    /* ===============================
       ZOOM + PIN (AFTER WIDTH)
    =============================== */
    gsap.to(containerRef.current, {
      scale: 1.08,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=300%",               // long pin = smooth
        scrub: 3,
        pin: true,
        anticipatePin: 1
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative h-[100vh] bg-white"
      >
        <div className="flex items-center justify-center h-screen">
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-[10px] lg:rounded-[32px] w-[70%] md:w-[50%]   h-[80vh] md:h-[100vh]"
            style={{
              width: "50%",
              transform: "scale(1)",
              willChange: "width, transform"   
            }}
          >
            {/* <img
              src="/img/Sctr-img-sec.png"
              className="absolute inset-0 w-full h-full object-cover -z-10"
              alt=""
            /> */}

            <iframe
              ref={iframeRef}
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/6-AjSG7Zw_4?enablejsapi=1&mute=1&controls=0&rel=0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      </section>     
    </>
  );
}

