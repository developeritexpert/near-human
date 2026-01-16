"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const THEME_COLORS = {
  highlight1: "#00B0B2",
  highlight2: "#FF6B9D",
  textPrimary: "#FFFFFF",
};

// Hero frames from animation-radiunt directory (timecode-based naming)
const FRAME_NAMES = [
  "frame_0_00_0f", "frame_0_00_2f", "frame_0_00_4f", "frame_0_00_6f", "frame_0_00_8f",
  "frame_0_00_10f", "frame_0_00_12f", "frame_0_00_14f", "frame_0_00_16f", "frame_0_00_18f",
  "frame_0_00_20f", "frame_0_00_22f", "frame_0_00_24f", "frame_0_00_26f", "frame_0_00_28f",
  "frame_0_01_0f", "frame_0_01_2f", "frame_0_01_4f", "frame_0_01_6f", "frame_0_01_8f",
  "frame_0_01_10f", "frame_0_01_12f", "frame_0_01_15f", "frame_0_01_17f", "frame_0_01_19f",
  "frame_0_01_21f", "frame_0_01_23f", "frame_0_01_25f", "frame_0_01_27f", "frame_0_01_29f",
  "frame_0_02_1f", "frame_0_02_3f", "frame_0_02_5f", "frame_0_02_7f", "frame_0_02_9f",
  "frame_0_02_11f", "frame_0_02_13f", "frame_0_02_15f", "frame_0_02_17f", "frame_0_02_19f",
  "frame_0_02_21f", "frame_0_02_23f", "frame_0_02_26f", "frame_0_02_28f",
  "frame_0_03_0f", "frame_0_03_2f", "frame_0_03_4f", "frame_0_03_6f", "frame_0_03_8f",
  "frame_0_03_10f", "frame_0_03_13f", "frame_0_03_15f", "frame_0_03_17f", "frame_0_03_19f",
  "frame_0_03_21f", "frame_0_03_23f", "frame_0_03_25f", "frame_0_03_27f", "frame_0_03_29f",
  "frame_0_04_1f", "frame_0_04_3f", "frame_0_04_5f", "frame_0_04_7f", "frame_0_04_9f",
  "frame_0_04_11f", "frame_0_04_13f", "frame_0_04_15f", "frame_0_04_17f", "frame_0_04_19f",
  "frame_0_04_21f", "frame_0_04_23f", "frame_0_04_25f", "frame_0_04_27f", "frame_0_04_29f",
  "frame_0_05_1f", "frame_0_05_3f", "frame_0_05_6f", "frame_0_05_8f", "frame_0_05_10f",
  "frame_0_05_12f", "frame_0_05_14f", "frame_0_05_16f", "frame_0_05_18f", "frame_0_05_20f",
  "frame_0_05_22f", "frame_0_05_24f", "frame_0_05_26f", "frame_0_05_28f",
  "frame_0_06_0f", "frame_0_06_2f", "frame_0_06_4f", "frame_0_06_6f", "frame_0_06_8f",
  "frame_0_06_10f", "frame_0_06_12f", "frame_0_06_14f", "frame_0_06_16f", "frame_0_06_18f",
  "frame_0_06_20f", "frame_0_06_22f", "frame_0_06_24f", "frame_0_06_26f", "frame_0_06_28f",
  "frame_0_07_0f", "frame_0_07_2f", "frame_0_07_4f", "frame_0_07_6f", "frame_0_07_8f",
  "frame_0_07_10f", "frame_0_07_12f", "frame_0_07_14f", "frame_0_07_16f", "frame_0_07_18f",
  "frame_0_07_20f", "frame_0_07_22f", "frame_0_07_24f", "frame_0_07_26f", "frame_0_07_28f",
  "frame_0_08_1f", "frame_0_08_3f", "frame_0_08_5f", "frame_0_08_7f", "frame_0_08_9f",
  "frame_0_08_11f", "frame_0_08_13f", "frame_0_08_15f", "frame_0_08_17f", "frame_0_08_19f",
  "frame_0_08_21f", "frame_0_08_23f", "frame_0_08_25f", "frame_0_08_27f", "frame_0_08_29f",
  "frame_0_09_1f", "frame_0_09_3f", "frame_0_09_5f", "frame_0_09_7f", "frame_0_09_9f",
  "frame_0_09_11f", "frame_0_09_13f", "frame_0_09_15f", "frame_0_09_17f", "frame_0_09_20f",
  "frame_0_09_22f", "frame_0_09_24f", "frame_0_09_26f", "frame_0_09_28f",
  "frame_0_10_0f", "frame_0_10_2f", "frame_0_10_4f", "frame_0_10_6f", "frame_0_10_8f",
  "frame_0_10_10f", "frame_0_10_13f", "frame_0_10_15f", "frame_0_10_17f", "frame_0_10_19f",
  "frame_0_10_21f", "frame_0_10_23f", "frame_0_10_25f", "frame_0_10_27f", "frame_0_10_29f",
  "frame_0_11_1f", "frame_0_11_3f", "frame_0_11_5f", "frame_0_11_7f", "frame_0_11_9f",
  "frame_0_11_11f", "frame_0_11_13f", "frame_0_11_15f", "frame_0_11_17f", "frame_0_11_19f",
  "frame_0_11_21f", "frame_0_11_23f", "frame_0_11_25f", "frame_0_11_27f", "frame_0_11_29f",
  "frame_0_12_1f", "frame_0_12_3f", "frame_0_12_5f", "frame_0_12_7f", "frame_0_12_9f",
  "frame_0_12_11f", "frame_0_12_13f", "frame_0_12_15f", "frame_0_12_17f", "frame_0_12_19f",
  "frame_0_12_21f", "frame_0_12_23f", "frame_0_12_25f", "frame_0_12_27f", "frame_0_12_29f",
  "frame_0_13_1f", "frame_0_13_3f", "frame_0_13_5f", "frame_0_13_7f", "frame_0_13_9f",
  "frame_0_13_11f", "frame_0_13_13f", "frame_0_13_15f", "frame_0_13_17f", "frame_0_13_19f",
  "frame_0_13_21f", "frame_0_13_23f", "frame_0_13_25f", "frame_0_13_27f", "frame_0_13_29f",
  "frame_0_14_1f", "frame_0_14_3f", "frame_0_14_5f", "frame_0_14_7f", "frame_0_14_9f",
  "frame_0_14_11f", "frame_0_14_13f", "frame_0_14_15f", "frame_0_14_17f", "frame_0_14_19f",
  "frame_0_14_21f", "frame_0_14_23f", "frame_0_14_25f", "frame_0_14_27f", "frame_0_14_29f",
  "frame_0_15_1f", "frame_0_15_3f", "frame_0_15_5f", "frame_0_15_7f", "frame_0_15_9f",
  "frame_0_15_11f", "frame_0_15_13f", "frame_0_15_15f", "frame_0_15_17f", "frame_0_15_19f",
  "frame_0_15_21f", "frame_0_15_23f", "frame_0_15_25f", "frame_0_15_27f", "frame_0_15_29f",
  "frame_0_16_0f",
];

const FRAME_PATH = (index: number) =>
  `/animation-radiunt/${FRAME_NAMES[index]}.jpeg`;

const TEXT_STEPS = [
  {
    id: 1,
    text: "The Future isn't",
    highlightIndex: 2,
    highlightColor: THEME_COLORS.highlight1,
  },
  {
    id: 2,
    text: "more apps",
    highlightIndex: -1,
    highlightColor: "",
  },
  {
    id: 3,
    text: "",
    highlightIndex: -1,
    highlightColor: "",
  },
  {
    id: 4,
    text: "It's a conversation",
    highlightIndex: -1,
    highlightColor: "",
  },
  {
    id: 5,
    text: "with the world around you.",
    highlightIndex: 4,
    highlightColor: THEME_COLORS.highlight2,
  },
  {
    id: 6,
    text: "",
    highlightIndex: -1,
    highlightColor: "",
  },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const frameIndexRef = useRef(0);

  useEffect(() => {
    let loadedCount = 0;
    FRAME_NAMES.forEach((_, i) => {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_NAMES.length) setLoaded(true);
      };
      imagesRef.current[i] = img;
    });
  }, []);

  useEffect(() => {
    if (!loaded || !containerRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false })!;
    let rw = 0;
    let rh = 0;
    let ratio = 1;

    const renderFrame = (i: number) => {
      const index = Math.round(i);
      if (index === frameIndexRef.current) return;
      frameIndexRef.current = index;
      const img = imagesRef.current[index];
      if (!img) return;

      const cr = rw / rh;
      let dw = rw,
        dh = rh,
        dx = 0,
        dy = 0;

      if (ratio > cr) {
        dh = rh;
        dw = dh * ratio;
        dx = (rw - dw) / 2;
      } else {
        dw = rw;
        dh = dw / ratio;
        dy = (rh - dh) / 2;
      }

      ctx.clearRect(0, 0, rw, rh);
      ctx.save();
      ctx.filter = "brightness(1.05) contrast(1.15) saturate(1.1)";
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      rw = window.innerWidth;
      rh = window.innerHeight;
      canvas.width = rw * dpr;
      canvas.height = rh * dpr;
      canvas.style.width = rw + "px";
      canvas.style.height = rh + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ratio = imagesRef.current[0]?.width / imagesRef.current[0]?.height || 1;
      renderFrame(frameIndexRef.current);
    };

    resize();
    window.addEventListener("resize", resize);

    const ctxGsap = gsap.context(() => {
      const anim = { frame: 0 };

      gsap.set("[data-step]", { autoAlpha: 0 });
      gsap.set("[data-word]", {
        autoAlpha: 0,
        y: 30,
        filter: "blur(10px)",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=500%",
          scrub: 0.2,
          pin: true,
          snap: {
            snapTo: 1 / TEXT_STEPS.length,
            duration: 0.25,
            ease: "power1.inOut",
          },
        },
      });

      tl.to(anim, {
        frame: FRAME_NAMES.length - 1,
        ease: "none",
        duration: 1,
        onUpdate: () => renderFrame(anim.frame),
      });

      TEXT_STEPS.forEach((step, i) => {
        const start = i / TEXT_STEPS.length;
        const dur = 1 / TEXT_STEPS.length;

        if (step.text) {
          tl.to(`[data-step="${step.id}"]`, { autoAlpha: 1, duration: 0.1 }, start);

          const words = step.text.split(" ");
          words.forEach((_, wi) => {
            tl.to(
              `[data-step="${step.id}"] [data-word="${wi}"]`,
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.3,
                ease: "power2.out",
              },
              start + (wi * dur) / (words.length + 1)
            );
          });

          if (i < TEXT_STEPS.length - 1) {
            tl.to(
              `[data-step="${step.id}"]`,
              { autoAlpha: 0, y: -30, duration: 0.25 },
              start + dur * 0.8
            );
          }
        }
      });
    }, containerRef);

    return () => {
      window.removeEventListener("resize", resize);
      ctxGsap.revert();
    };
  }, [loaded]);

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden bg-black">
      <div className="sticky top-0 h-screen w-full">
        <canvas ref={canvasRef} className="absolute inset-0" />

        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          {TEXT_STEPS.map((step) => (
            <div
              key={step.id}
              data-step={step.id}
              className="absolute flex flex-wrap justify-center gap-3 px-4"
            >
              {step.text.split(" ").map((word, wi) => {
                const isHighlight = wi === step.highlightIndex;
                return (
                  <span
                    key={wi}
                    data-word={wi}
                    style={{
                      fontSize: "clamp(2.5rem, 8vw, 6rem)",
                      fontWeight: 700,
                      lineHeight: 1.1,
                      color: isHighlight ? step.highlightColor : THEME_COLORS.textPrimary,
                      textShadow: isHighlight
                        ? `0 0 40px ${step.highlightColor}55`
                        : "0 2px 20px rgba(0,0,0,0.6)",
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}