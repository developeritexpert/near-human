"use client";

import Slider from "react-slick";
import { useRef, useState, useCallback, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

const THEME = {
  primary: "#00B0B2",
  dark: "#101717",
};

// ============================================
// NOTCH CONFIGURATION - CHANGE THESE VALUES
// ============================================
const NOTCH_CONFIG = {
  width: 4.5,      // Width of notch (% of card width) - increase for wider
  height: 19,     // Height of notch (% of card height) - increase for taller
  skew: 2,        // Skew offset (% of card) - increase for more parallelogram effect
  cornerRadius: 1.9, // Corner radius of the card (%)
  minY: 10,       // Minimum Y position (% from top)
  maxY: 80,       // Maximum Y position (% from top)
};

interface NewsItem {
  id: number;
  type: string;
  date: string;
  title: string;
  bgImage: string;
}

function LatestNewsSlider() {
  const sliderRef = useRef<any>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [mouseYMap, setMouseYMap] = useState<Record<number, number>>({});
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const latestNews: NewsItem[] = [
    {
      id: 1,
      type: "Announcement",
      date: "Jan 8, 2026",
      title: "How Micromobility Shaped a Broader Vision for Intelligence",
      bgImage: "/img/latest-slider-bg1.png",
    },
    {
      id: 2,
      type: "Announcement",
      date: "Jan 3, 2026",
      title: "Why the Future of Intelligent Devices Depends on the Edge",
      bgImage: "/img/latest-slider-bg1.png",
    },
    {
      id: 3,
      type: "Announcement",
      date: "Dec 22, 2025",
      title: "Latency as a Design Constraint: Why Speed Still Defines User Trust",
      bgImage: "/img/latest-slider-bg1.png",
    },
    {
      id: 4,
      type: "Announcement",
      date: "Jan 8, 2026",
      title: "How Micromobility Shaped a Broader Vision for Intelligence",
      bgImage: "/img/latest-slider-bg1.png",
    },
    {
      id: 5,
      type: "Announcement",
      date: "Jan 3, 2026",
      title: "Why the Future of Intelligent Devices Depends on the Edge",
      bgImage: "/img/latest-slider-bg1.png",
    },
    {
      id: 6,
      type: "Announcement",
      date: "Dec 22, 2025",
      title: "Latency as a Design Constraint: Why Speed Still Defines User Trust",
      bgImage: "/img/latest-slider-bg1.png",
    },
  ];

  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    beforeChange: () => setHoveredId(null),
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 680, settings: { slidesToShow: 1 } },
    ],
  };

  // Generate notch path using config
  const getNotchPath = useCallback((mouseY: number): string => {
    const { width: nw, height: nh, skew, cornerRadius: r, minY, maxY } = NOTCH_CONFIG;
    
    const centerY = minY + (maxY - minY) * mouseY;
    const top = centerY - nh / 2;
    const bottom = centerY + nh / 2;

    return `M${r},0 H${100 - r} A${r},${r} 0 0 1 100,${r} V${100 - r} A${r},${r} 0 0 1 ${100 - r},100 H${r} A${r},${r} 0 0 1 0,${100 - r} V${bottom + skew} L${nw},${bottom - skew} L${nw},${top + skew} L0,${top - skew} V${r} A${r},${r} 0 0 1 ${r},0 Z`;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, itemId: number) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relY = (e.clientY - rect.top) / rect.height;
    const clampedY = Math.max(0.08, Math.min(0.92, relY));
    setMouseYMap(prev => ({ ...prev, [itemId]: clampedY }));
  }, [isMobile]);

  const handleMouseEnter = useCallback((itemId: number) => {
    if (isMobile) return;
    setHoveredId(itemId);
    setMouseYMap(prev => ({ ...prev, [itemId]: 0.5 }));
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, []);

  const handlePrev = () => {
    setHoveredId(null);
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    setHoveredId(null);
    sliderRef.current?.slickNext();
  };

  return (
    <section className="px-[10px] sm:px-[20px] md:px-[30px] lg:px-[60px] pb-[40px] md:pb-[70px] lg:pb-[100px] xl:pb-[120px]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-[#101717] text-[32px] md:text-[45px] lg:text-[55px] xl:text-[77px] font-[450]">
          Latest News
        </h3>
        <div className="flex gap-[10px]">
          <button
            onClick={handlePrev}
            className="h-[40px] w-[40px] md:h-[50px] md:w-[50px] xl:h-[90px] xl:w-[90px] rounded-[8px] bg-[#1017170F] flex justify-center items-center hover:bg-[#1017171A] transition-colors"
          >
            <svg width="10" height="20" viewBox="0 0 10 20" fill="white">
              <path d="M8.61437 0.901119L1.78396 9.74401L8.61437 17.8692" stroke="#101717" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="h-[40px] w-[40px] md:h-[50px] md:w-[50px] xl:h-[90px] xl:w-[90px] rounded-[8px] bg-[#1017170F] flex justify-center items-center hover:bg-[#1017171A] transition-colors"
          >
            <svg width="10" height="20" viewBox="0 0 10 20" fill="none">
              <path d="M0.885628 0.901119L7.71604 9.74401L0.885626 17.8692" stroke="#101717" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="w-full mt-[30px] md:mt-[59px]">
        <Slider ref={sliderRef} {...settings}>
          {latestNews.map((item, idx) => {
            const isHovered = hoveredId === item.id && !isMobile;
            const mouseY = mouseYMap[item.id] ?? 0.5;
            const clipId = `notch-clip-${item.id}-${idx}`;

            return (
              <div key={`${item.id}-${idx}`} className="px-3">
                <div
                  className="relative h-full min-h-[450px] lg:min-h-[653px] rounded-[16px] overflow-hidden cursor-pointer"
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={(e) => handleMouseMove(e, item.id)}
                >
                  {/* Default Background */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300 rounded-[16px]"
                    style={{
                      backgroundColor: "#1017170F",
                      opacity: isHovered ? 0 : 1,
                    }}
                  />

                  {/* Hover Background with SVG Notch */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{ opacity: isHovered ? 1 : 0 }}
                  >
                    {/* SVG for clip path definition */}
                    <svg className="absolute" width="0" height="0" >
                      <defs>
                        <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                          <path
                            d={getNotchPath(mouseY)}
                            transform="scale(0.01, 0.01)"
                          />
                        </clipPath>
                      </defs>
                    </svg>

                    {/* Image container with clip-path */}
                    <div
                      className="absolute inset-0 transition-[clip-path] duration-100 ease-out"
                      style={{
                        clipPath: `url(#${clipId})`,
                        WebkitClipPath: `url(#${clipId})`,
                      }}
                    >
                      <img
                        src={item.bgImage}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40" />
                    </div>

                    {/* Notch glow */}
                    <div
                      className="absolute left-0 transition-all duration-100"
                      style={{
                        top: `${NOTCH_CONFIG.minY + (NOTCH_CONFIG.maxY - NOTCH_CONFIG.minY) * mouseY}%`,
                        transform: "translateY(-50%)",
                        width: "80px",
                        height: `${NOTCH_CONFIG.height * 1.5}%`,
                        background: `radial-gradient(ellipse at left, ${THEME.primary}50 0%, transparent 70%)`,
                        filter: "blur(20px)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>

                  {/* Left indicator bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 z-20 transition-all duration-200"
                    style={{
                      background: isHovered
                        ? `linear-gradient(180deg, transparent 0%,  ${mouseY * 100}%, transparent 100%)`
                        : "transparent",
                      boxShadow: isHovered ? `0 0 15px ${THEME.primary}60` : "none",
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full min-h-[450px] lg:min-h-[653px] p-[25px] sm:p-[35px]">
                    <div className="flex justify-between w-full">
                      <p
                        className="text-[18px] font-[450] transition-colors duration-300"
                        style={{ color: isHovered ? "#fff" : THEME.primary }}
                      >
                        {item.type}
                      </p>
                      <p
                        className="text-[18px] font-[450] transition-colors duration-300"
                        style={{ color: isHovered ? THEME.primary : THEME.dark }}
                      >
                        {item.date}
                      </p>
                    </div>

                    <div className="max-w-[398px] mt-[16px]">
                      <h4
                        className="text-[24px] sm:text-[28px] lg:text-[36px] font-[450] transition-colors duration-300"
                        style={{ color: isHovered ? "#fff" : THEME.dark }}
                      >
                        {item.title}
                      </h4>
                    </div>

                    {/* Read More Button */}
                    <div
                      className="mt-auto transition-all duration-300"
                      style={{
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? "translateY(0)" : "translateY(20px)",
                      }}
                    >
                      <Link
                        href="/blogs-detail"
                        className="inline-flex items-center gap-2 text-[16px] py-[13px] px-[34px] rounded-[7px] transition-all duration-300 border"
                        style={{
                          color: "#fff",
                          borderColor: "rgba(255,255,255,0.5)",
                          background: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#fff";
                          e.currentTarget.style.color = THEME.dark;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#fff";
                        }}
                      >
                        Read More
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Number indicator */}
                  <div
                    className="absolute bottom-6 right-6 text-[100px] font-bold leading-none pointer-events-none z-0 transition-all duration-300"
                    style={{
                      color: isHovered ? "rgba(255,255,255,0.1)" : "transparent",
                      transform: isHovered ? "translateY(0)" : "translateY(20px)",
                    }}
                  >
                    {String(item.id).padStart(2, "0")}
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </section>
  );
}

export default LatestNewsSlider;