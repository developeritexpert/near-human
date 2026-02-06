"use client";
import React, { useEffect, useState } from "react";

const Footer = () => {
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
    <footer className="relative w-full overflow-hidden border-none bg-white px-[20px] py-[50px] md:px-[30px] md:py-[90px] md:pb-[70px] lg:px-[50px] lg:pt-[140px] lg:pb-[160px]">
      <div className="absolute inset-0 z-1">
        <img
          src="img/footer-bg.png"
          alt=""
          className="h-full w-full object-cover md:object-fill"
        />
      </div>

      {/* Left Side SVG (replacing footr-bg-shade.png) */}
      <div className="pointer-events-none absolute top-[40px] left-0 z-2 h-[369px] w-[300px] md:w-[400px] lg:w-[440px] xl:w-[650px] 2xl:w-[821px]">
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
              id="footer-right-grey-gradient"
              x1="939.5"
              y1="-18"
              x2="-128.494"
              y2="353.017"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#00B0B2" stopOpacity="0" />
              <stop offset="0.5" stopColor="#00B0B2" />
              <stop offset="1" stopColor="#00B0B2" stopOpacity="0" />
            </linearGradient>

            <linearGradient
              id="footer-right-glow-gradient"
              x1="939.5"
              y1="-18"
              x2="-128.494"
              y2="353.017"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#fff" stopOpacity="0" />
              <stop offset="30%" stopColor="#fff" stopOpacity="1" />
              <stop offset="50%" stopColor="#fff" />
              <stop offset="70%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Static grey paths */}
          <path
            d="M820.5 0V162C820.167 183 811.5 220 766.5 220L540.5 219H263.5C241.833 216.333 198.7 224.4 199.5 278V323C197.167 346.167 176.3 386.4 111.5 362L-1 318"
            stroke="url(#footer-right-grey-gradient)"
            strokeWidth="1"
            strokeOpacity="1"
            fill="none"
          />

          {/* First animated glow path */}
          <path
            d="M820.5 0V162C820.167 183 811.5 220 766.5 220L540.5 219H263.5C241.833 216.333 198.7 224.4 199.5 278V323C197.167 346.167 176.3 386.4 111.5 362L-1 318"
            stroke="url(#footer-right-glow-gradient)"
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

      {/* Right Side SVG (replacing footr-bg-shade1.png) */}
      <div className="pointer-events-none absolute right-0 bottom-0 z-2 h-[424px] w-[250px] md:w-[350px] lg:w-[400px] xl:w-[526px]">
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
              id="footer-left-grey-gradient"
              x1="600.405"
              y1="447.247"
              x2="-135.826"
              y2="305.709"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.148112" stopColor="#00B0B2" stopOpacity="0" />
              <stop offset="0.5" stopColor="#00B0B2" />
              <stop offset="1" stopColor="#00B0B2" stopOpacity="0" />
            </linearGradient>

            <linearGradient
              id="footer-left-glow-gradient"
              x1="600.405"
              y1="447.247"
              x2="-135.826"
              y2="305.709"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#fff" stopOpacity="0" />
              <stop offset="30%" stopColor="#fff" stopOpacity="1" />
              <stop offset="50%" stopColor="#fff" />
              <stop offset="70%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Static grey path */}
          <path
            d="M0.538941 426.5V243.998C-0.303982 216.868 12.1713 175.75 73.8733 178.278H266.566C288.987 179.963 333.426 169.38 331.808 113.568V57.958C329.279 36.0511 341.114 -5.9428 408.682 1.33704H524.5"
            stroke="url(#footer-left-grey-gradient)"
            strokeWidth="1"
            strokeOpacity="0.5"
            fill="none"
          />

          {/* Animated glow path */}
          <path
            d="M0.538941 426.5V243.998C-0.303982 216.868 12.1713 175.75 73.8733 178.278H266.566C288.987 179.963 333.426 169.38 331.808 113.568V57.958C329.279 36.0511 341.114 -5.9428 408.682 1.33704H524.5"
            stroke="url(#footer-left-glow-gradient)"
            strokeWidth="2"
            strokeOpacity="1"
            strokeDasharray="15 800"
            strokeDashoffset={`${glowPosition}`}
            fill="none"
            style={{
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

      <div className="container-custom relative z-5 grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-20">
        <div className="col-span-1 md:col-span-2">
          <a href="#">
            <img
              src="/img/footer-logo.png"
              alt=""
              className="max-w-[200px] md:max-w-[250px] lg:max-w-full"
            />
          </a>

          <p className="mt-[40px] text-[18px] leading-relaxed font-normal tracking-widest text-white md:mt-[90px] lg:!mt-[138px]">
            Copyright Near Human © 2026
            <br />
            All Rights Reserved
          </p>
        </div>

        <div>
          <h4 className="!mb-[15px] text-[22px] font-normal text-white md:text-[19px] lg:text-[27px]">
            Quick Links
          </h4>
          <ul className="text-[#F7F8F8]">
            <li className="!mb-[20px]">
              <a
                href="/#"
                className="hover:text-primary text-[16px] !font-normal transition-colors duration-300"
              >
                Home
              </a>
            </li>
            <li className="!mb-[20px]">
              <a
                href="/about"
                className="hover:text-primary !font-normal transition-colors duration-300"
              >
                About
              </a>
            </li>
            <li className="!mb-[20px]">
              <a
                href="/blogs"
                className="hover:text-primary !font-normal transition-colors duration-300"
              >
                Blogs
              </a>
            </li>
            <li className="!mb-[20px]">
              <a
                href="/contact"
                className="hover:text-primary !font-normal transition-colors duration-300"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="!mb-[15px] text-[22px] font-normal text-white md:text-[19px] lg:text-[27px]">
            Connect with our experts today
          </h4>
          <ul className="text-[#F7F8F8]">
            <li className="!mb-[20px]">
              <a
                href="https://www.linkedin.com/company/nearhuman"
                className="hover:text-primary flex items-center gap-2 text-[16px] !font-normal transition-colors duration-300"
              >
                <span className="text-[8px]">
                  <div className="w-[20px]">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.78894 4.11035H0.244141V12.3252H2.78894V4.11035Z"
                        fill="#F7F8F8"
                      />
                      <path
                        d="M1.50304 3.03716C2.3323 3.03716 3.00607 2.35821 3.00607 1.51858C3.00607 0.678954 2.3323 0 1.50304 0C0.673779 0 0 0.678954 0 1.51858C0 2.35821 0.668596 3.03716 1.50304 3.03716Z"
                        fill="#F7F8F8"
                      />
                      <path
                        d="M6.85159 8.01799C6.85159 6.86221 7.38543 6.17289 8.40128 6.17289C9.3342 6.17289 9.78511 6.83111 9.78511 8.01799C9.78511 9.19969 9.78511 12.3302 9.78511 12.3302H12.3144C12.3144 12.3302 12.3144 9.32926 12.3144 7.12654C12.3144 4.92381 11.0653 3.86133 9.32383 3.86133C7.58238 3.86133 6.84641 5.21924 6.84641 5.21924V4.1101H4.40527V12.325H6.84641C6.8516 12.3301 6.85159 9.28262 6.85159 8.01799Z"
                        fill="#F7F8F8"
                      />
                    </svg>
                  </div>
                </span>
                LinkedIn
              </a>
            </li>
            <li className="!mb-[20px]">
              <a
                href="https://www.instagram.com/near.human/"
                className="hover:text-primary flex items-center gap-2 text-[16px] !font-normal transition-colors duration-300"
              >
                <span className="text-[8px]">
                  <div className="w-[20px]">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.49707 1.34947C9.49821 1.34947 9.73466 1.35525 10.5247 1.39562C11.2571 1.43022 11.6551 1.55131 11.9146 1.65512C12.2664 1.79353 12.5143 1.955 12.7739 2.21452C13.0391 2.4798 13.2006 2.72777 13.3332 3.07379C13.4371 3.33907 13.5582 3.737 13.5928 4.46363C13.6274 5.25371 13.6389 5.49016 13.6389 7.4913C13.6389 9.49244 13.6331 9.72888 13.5928 10.519C13.5582 11.2514 13.4371 11.6493 13.3332 11.9088C13.1948 12.2606 13.0334 12.5086 12.7739 12.7739C12.5143 13.0334 12.2606 13.2006 11.9146 13.3332C11.6493 13.4371 11.2514 13.5582 10.5247 13.5928C9.73466 13.6274 9.49821 13.6389 7.49707 13.6389C5.49593 13.6389 5.25948 13.6331 4.46941 13.5928C3.737 13.5582 3.33908 13.4371 3.07956 13.3332C2.72778 13.1948 2.4798 13.0334 2.21452 12.7739C1.955 12.5086 1.78776 12.2606 1.65512 11.9088C1.55131 11.6435 1.43021 11.2456 1.39561 10.519C1.36101 9.72888 1.34947 9.49244 1.34947 7.4913C1.34947 5.49016 1.35524 5.25371 1.39561 4.46363C1.43021 3.73123 1.55131 3.3333 1.65512 3.07379C1.79353 2.72201 1.955 2.47403 2.21452 2.21452C2.4798 1.94924 2.72778 1.78776 3.07956 1.65512C3.34484 1.55131 3.74277 1.43022 4.46941 1.39562C5.25948 1.36101 5.49593 1.34947 7.49707 1.34947ZM7.49707 0C5.46133 0 5.20758 0.0115262 4.40597 0.0461281C3.61013 0.0807299 3.06226 0.207607 2.5836 0.39215C2.08764 0.58246 1.67242 0.841974 1.2572 1.2572C0.841979 1.67242 0.582465 2.09342 0.392155 2.58361C0.207611 3.06227 0.0807343 3.60437 0.0461325 4.40598C0.0115306 5.20759 0 5.46133 0 7.49707C0 9.53281 0.00576363 9.78655 0.0461325 10.5882C0.0807343 11.384 0.207611 11.9319 0.392155 12.4105C0.582465 12.9007 0.841979 13.3217 1.2572 13.7369C1.67242 14.1522 2.09341 14.4117 2.5836 14.602C3.06226 14.7865 3.60436 14.9134 4.40597 14.948C5.20758 14.9826 5.46133 14.9941 7.49707 14.9941C9.53281 14.9941 9.78656 14.9884 10.5882 14.948C11.384 14.9134 11.9319 14.7865 12.4105 14.602C12.9065 14.4117 13.3217 14.1522 13.7369 13.7369C14.1522 13.3217 14.4117 12.9007 14.602 12.4105C14.7865 11.9319 14.9134 11.3898 14.948 10.5882C14.9826 9.78655 14.9941 9.53281 14.9941 7.49707C14.9941 5.46133 14.9884 5.20759 14.948 4.40598C14.9134 3.61014 14.7865 3.06227 14.602 2.58361C14.4117 2.09342 14.1522 1.67242 13.7369 1.2572C13.3217 0.841974 12.9007 0.58246 12.4105 0.39215C11.9319 0.207607 11.3898 0.0807299 10.5882 0.0461281C9.78656 0.0115262 9.53281 0 7.49707 0Z"
                        fill="#F7F8F8"
                      />
                      <path
                        d="M7.49687 3.65039C5.36886 3.65039 3.64453 5.37473 3.64453 7.50274C3.64453 9.63076 5.36886 11.3551 7.49687 11.3551C9.62489 11.3551 11.3492 9.63076 11.3492 7.50274C11.3492 5.37473 9.62489 3.65039 7.49687 3.65039ZM7.49687 9.99984C6.11856 9.99984 4.99977 8.88105 4.99977 7.50274C4.99977 6.12444 6.11856 5.00563 7.49687 5.00563C8.87518 5.00563 9.99397 6.12444 9.99397 7.50274C9.99397 8.88105 8.87518 9.99984 7.49687 9.99984Z"
                        fill="#F7F8F8"
                      />
                      <path
                        d="M12.3996 3.49473C12.3996 3.99088 11.9958 4.39472 11.4996 4.39472C11.0035 4.39472 10.5996 3.99088 10.5996 3.49473C10.5996 2.99857 11.0035 2.59473 11.4996 2.59473C11.9958 2.59473 12.3996 2.99857 12.3996 3.49473Z"
                        fill="#F7F8F8"
                      />
                    </svg>
                  </div>
                </span>
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
