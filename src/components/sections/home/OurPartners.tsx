"use client";

import React, { useState, useRef, useEffect } from "react";

function OurPartners() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseOverGrid, setIsMouseOverGrid] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gridElement = gridRef.current;
    if (!gridElement) return;

    const handleMouseMove = (event: MouseEvent) => {
      const gridRect = gridElement.getBoundingClientRect();
      const relativeX = event.clientX - gridRect.left;
      const relativeY = event.clientY - gridRect.top;

      setMousePosition({
        x: relativeX,
        y: relativeY,
      });
    };

    const handleMouseEnter = () => {
      setIsMouseOverGrid(true);
    };

    const handleMouseLeave = () => {
      setIsMouseOverGrid(false);
      // Reset to center
      const gridRect = gridElement.getBoundingClientRect();
      setMousePosition({
        x: gridRect.width / 2,
        y: gridRect.height / 2,
      });
    };

    // Add listeners to the grid element, not the window
    gridElement.addEventListener("mousemove", handleMouseMove);
    gridElement.addEventListener("mouseenter", handleMouseEnter);
    gridElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      gridElement.removeEventListener("mousemove", handleMouseMove);
      gridElement.removeEventListener("mouseenter", handleMouseEnter);
      gridElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden px-[20px] pt-[50px] md:px-[30px] lg:px-[50px]">
        <div className="absolute bottom-[-200px] left-0 -z-1 h-full max-h-[369px] w-full max-w-[821px]">
          <img src="img/bg-line1.png" alt="" />
        </div>

        <div className="container mx-auto">
          <h1 className="text-center text-[32px] text-[#101717] sm:text-[38px] md:text-[45px] lg:text-[55px] xl:text-[77px]">
            Our Partners
          </h1>
          <div className="pointer-events-none relative -bottom-[100px] z-[12] h-[100px] w-full bg-gradient-to-b from-white to-transparent"></div>
          <div
            ref={gridRef}
            className="grid-bg relative mx-auto flex flex-col gap-[2px] overflow-hidden bg-[#1017171a]"
          >
            <div
              className="follow-bg pointer-events-none absolute h-[400px] w-[400px] transition-all duration-150 ease-out"
              style={{
                left: `${mousePosition.x}px`,
                top: `${mousePosition.y}px`,
                opacity: isMouseOverGrid ? 1 : 0,
                filter: "blur(60px)",
                background:
                  "radial-gradient(circle at 50% 50%, #00B0B2, transparent 15rem)",
                transform: "translate(-50%, -50%)",
              }}
            ></div>

            <div className="relative z-10 flex grid grid-cols-[0.2fr_1fr_0.2fr] justify-center gap-[2px] md:grid-cols-[0.3fr_1fr_1fr_1fr_0.3fr]">
              <div className="top_row_empty_box relative h-[100px] bg-[#ffffff]"></div>
              <div className="top_row_empty_box relative h-[100px] bg-[#ffffff]"></div>
              <div className="top_row_empty_box relative h-[100px] bg-[#ffffff]"></div>
              <div className="top_row_empty_box relative hidden h-[100px] bg-[#ffffff] md:block"></div>
              <div className="top_row_empty_box relative hidden h-[100px] bg-[#ffffff] md:block"></div>
            </div>

            <div className="relative z-10 flex grid grid-cols-[0.2fr_1fr_0.2fr] justify-center gap-[2px] md:grid-cols-[0.3fr_1fr_1fr_1fr_0.3fr]">
              <div className="h-[250px] bg-[#ffffff]"></div>
              <div className="flex h-[250px] items-center justify-center bg-[#fff] duration-400 hover:bg-[#ffffffaa]">
                <img
                  src="/img/partner-logo1.png"
                  alt=""
                  className="mix-blend-luminosity"
                />
              </div>
              <div className="block h-[250px] bg-[#ffffff] md:hidden"></div>
              <div className="block h-[250px] bg-[#ffffff] md:hidden"></div>
              <div className="flex h-[250px] items-center justify-center bg-[#fff] duration-400 hover:bg-[#ffffffaa]">
                <img
                  src="/img/partner-logo2.png"
                  alt=""
                  className="mix-blend-luminosity"
                />
              </div>
              <div className="block h-[250px] bg-[#ffffff] md:hidden"></div>
              <div className="block h-[250px] bg-[#ffffff] md:hidden"></div>
              <div className="flex h-[250px] items-center justify-center bg-[#fff] duration-400 hover:bg-[#ffffffaa]">
                <img
                  src="/img/partner-logo3.png"
                  alt=""
                  className="mix-blend-luminosity"
                />
              </div>
              <div className="h-[250px] bg-[#ffffff]"></div>
            </div>

            <div className="relative z-10 flex grid grid-cols-[0.2fr_1fr_0.2fr] justify-center gap-[2px] md:grid-cols-[0.3fr_1fr_1fr_1fr_0.3fr]">
              <div className="bottom_row_empty_box relative hidden h-[100px] bg-[#ffffff] md:block"></div>
              <div className="bottom_row_empty_box relative hidden h-[100px] bg-[#ffffff] md:block"></div>
              <div className="bottom_row_empty_box relative h-[100px] bg-[#ffffff]"></div>
              <div className="bottom_row_empty_box relative h-[100px] bg-[#ffffff]"></div>
              <div className="bottom_row_empty_box relative h-[100px] bg-[#ffffff]"></div>
            </div>
          </div>
          <div className="pointer-events-none relative -top-[100px] z-[12] h-[100px] w-full bg-gradient-to-t from-white to-transparent"></div>{" "}
        </div>
      </section>
    </div>
  );
}

export default OurPartners;
