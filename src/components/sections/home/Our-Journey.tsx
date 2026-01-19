import React, { useEffect, useState } from "react";
import Link from "next/link";

function OurJourney() {
  const [glowPosition, setGlowPosition] = useState<number>(0);

  // Animate glow along paths
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = 0;
    const speed = 0.2;

    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;

      setGlowPosition((prev) => {
        let newPos = prev + delta * 0.001 * speed;
        return newPos >= 100 ? 0 : newPos;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* left Side SVG */}
      <div className="pointer-events-none absolute top-0 left-0 z-0 h-full w-1/3 md:w-1/2 lg:w-[40%]">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 821 371"
          preserveAspectRatio="xMaxYMin meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="right-grey-gradient"
              x1="939.5"
              y1="-18"
              x2="-128.494"
              y2="353.017"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#D1D5DB" stopOpacity="0" />
              <stop offset="0.5" stopColor="#D1D5DB" />
              <stop offset="1" stopColor="#D1D5DB" stopOpacity="0" />
            </linearGradient>

            <linearGradient
              id="right-glow-gradient"
              x1="939.5"
              y1="-18"
              x2="-128.494"
              y2="353.017"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#00B0B2" stopOpacity="0" />
              <stop offset="30%" stopColor="#00B0B2" stopOpacity="1" />
              <stop offset="50%" stopColor="#00B0B2" />
              <stop offset="70%" stopColor="#00B0B2" stopOpacity="1" />
              <stop offset="100%" stopColor="#00B0B2" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Static grey paths */}
          <path
            d="M820.5 0V162C820.167 183 811.5 220 766.5 220L540.5 219H263.5C241.833 216.333 198.7 224.4 199.5 278V323C197.167 346.167 176.3 386.4 111.5 362L-1 318"
            stroke="url(#right-grey-gradient)"
            strokeWidth="1"
            strokeOpacity="1"
            fill="none"
          />

          {/* First animated glow path */}
          <path
            d="M820.5 0V162C820.167 183 811.5 220 766.5 220L540.5 219H263.5C241.833 216.333 198.7 224.4 199.5 278V323C197.167 346.167 176.3 386.4 111.5 362L-1 318"
            stroke="url(#right-glow-gradient)"
            strokeWidth="3"
            strokeOpacity="1"
            strokeDasharray="20 1000"
            strokeDashoffset={`${glowPosition}`}
            fill="none"
            style={{
              filter: "drop-shadow(50px 50px 50px #00B0B2)",
              animation: "pulse 3.5s ease-in-out infinite 0.5s",
            }}
          >
            <animate
              attributeName="stroke-dashoffset"
              values="1000; 0"
              dur="3s"
              repeatCount="indefinite"
              calcMode="linear"
            />
          </path>
        </svg>
      </div>

      {/* Right Side SVG */}
      <div className="pointer-events-none absolute right-0 bottom-0 z-0 w-1/3 md:w-1/2 lg:w-[40%]">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 523 427"
          preserveAspectRatio="xMinYMin meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="left-grey-gradient"
              x1="600.405"
              y1="447.247"
              x2="-135.826"
              y2="305.709"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.148112" stopColor="#D1D5DB" stopOpacity="0" />
              <stop offset="0.5" stopColor="#D1D5DB" />
              <stop offset="1" stopColor="#D1D5DB" stopOpacity="0" />
            </linearGradient>

            <linearGradient
              id="left-glow-gradient"
              x1="600.405"
              y1="447.247"
              x2="-135.826"
              y2="305.709"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#00B0B2" stopOpacity="0" />
              <stop offset="30%" stopColor="#00B0B2" stopOpacity="1" />
              <stop offset="50%" stopColor="#00B0B2" />
              <stop offset="70%" stopColor="#00B0B2" stopOpacity="1" />
              <stop offset="100%" stopColor="#00B0B2" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Static grey path */}
          <path
            d="M0.538941 426.5V243.998C-0.303982 216.868 12.1713 175.75 73.8733 178.278H266.566C288.987 179.963 333.426 169.38 331.808 113.568V57.958C329.279 36.0511 341.114 -5.9428 408.682 1.33704H524.5"
            stroke="url(#left-grey-gradient)"
            strokeWidth="1"
            strokeOpacity="0.5"
            fill="none"
          />

          {/* Animated glow path */}
          <path
            d="M0.538941 426.5V243.998C-0.303982 216.868 12.1713 175.75 73.8733 178.278H266.566C288.987 179.963 333.426 169.38 331.808 113.568V57.958C329.279 36.0511 341.114 -5.9428 408.682 1.33704H524.5"
            stroke="url(#left-glow-gradient)"
            strokeWidth="2"
            strokeOpacity="1"
            strokeDasharray="15 800"
            strokeDashoffset={`${glowPosition}`}
            fill="none"
            style={{
              boxShadow: "20px 20px 20px 20px #00B0B2",
              filter: "drop-shadow(0px 0px 20px #00B0B2)",
              animation: "pulse 3s ease-in-out infinite",
            }}
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0; 800"
              dur="4s"
              repeatCount="indefinite"
              calcMode="linear"
            />
          </path>
        </svg>
      </div>

      {/* Content */}
      <section className="relative z-10 px-[20px] py-[40px] md:px-[30px] md:py-[70px] lg:px-[50px] lg:pt-[100px] lg:pb-[100px] xl:pt-[127px] xl:pb-[26px]">
        <div className="container mx-auto">
          <div className="mx-auto max-w-[993px]">
            <h3 className="text-center text-[28px] md:text-[35px] lg:text-[45px] xl:text-[55px]">
              Our journey started with{" "}
              <span className="!font-bold"> Scootrr,</span> solving real world
              challenges
            </h3>
          </div>
          <div className="mt-[60px] flex flex-wrap justify-center gap-4 sm:flex-nowrap">
            <Link
              href="/early-access"
              className="relative z-20 flex w-full max-w-[170px] justify-center rounded-lg border border-[#00B0B2] bg-[#00B0B2] py-[18px] text-[16px] text-white transition hover:border-[#101717] hover:bg-white hover:text-[#101717]"
            >
              MDP
            </Link>
            <Link
              href="/contact"
              className="relative z-20 flex w-full max-w-[170px] justify-center rounded-lg border border-[#101717] py-[18px] text-[16px] text-[#101717] transition hover:border-[#00B0B2] hover:bg-[#00B0B2] hover:text-[#fff]"
            >
              Scootrr
            </Link>
            <Link
              href="/explore"
              className="relative z-20 flex w-full max-w-[170px] justify-center rounded-lg border border-[#101717] py-[18px] text-[16px] text-[#101717] transition hover:border-[#00B0B2] hover:bg-[#00B0B2] hover:text-[#fff]"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes flow {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -400;
          }
        }

        /* Make sure SVGs don't block interaction */
        .pointer-events-none * {
          pointer-events: none;
        }

        /* Smooth animations */
        path {
          transition: opacity 0.3s ease;
        }

        /* Optional: Add a subtle background gradient */
        .relative.overflow-hidden::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            circle at center,
            transparent 0%,
            rgba(0, 176, 178, 0.03) 70%,
            transparent 100%
          );
          z-index: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

export default OurJourney;
