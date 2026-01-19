"use client";

import React, { useState, useRef, useEffect } from "react";

function OurPartners() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseOverGrid, setIsMouseOverGrid] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!gridRef.current) return;

      const gridRect = gridRef.current.getBoundingClientRect();

      // Check if mouse is within grid boundaries
      if (
        event.clientX >= gridRect.left &&
        event.clientX <= gridRect.right &&
        event.clientY >= gridRect.top &&
        event.clientY <= gridRect.bottom
      ) {
        // Calculate relative position within the grid
        const relativeX = event.clientX - gridRect.left;
        const relativeY = event.clientY - gridRect.top;

        setMousePosition({
          x: relativeX,
          y: relativeY,
        });
      }
    };

    const handleMouseEnter = () => {
      setIsMouseOverGrid(true);
    };

    const handleMouseLeave = () => {
      setIsMouseOverGrid(false);
      // Reset position to center when mouse leaves
      if (gridRef.current) {
        const gridRect = gridRef.current.getBoundingClientRect();
        setMousePosition({
          x: gridRect.width / 2,
          y: gridRect.height / 2,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    if (gridRef.current) {
      gridRef.current.addEventListener("mouseenter", handleMouseEnter);
      gridRef.current.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (gridRef.current) {
        gridRef.current.removeEventListener("mouseenter", handleMouseEnter);
        gridRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden px-[20px] pt-[40px] pb-[100px] md:px-[30px] md:pt-[70px] md:pb-[150px] lg:px-[50px] lg:pt-[100px] lg:pb-[200px] xl:pt-[125px] xl:pb-[318px]">
        <div className="move-lft absolute bottom-[25px] left-[42%] w-full">
          <div className="h-[50px] w-[50px] rounded-full bg-[#00B0B2] blur-xl"></div>
        </div>

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
            className="grid-bg relative mx-auto flex max-w-[878px] flex-col gap-[2px] overflow-hidden bg-[#1017171a]"
          >
            <div
              className="follow-bg pointer-events-none absolute h-[400px] w-[400px] transition-all duration-150 ease-out"
              style={{
                left: `${mousePosition.x}px`,
                top: `${mousePosition.y}px`,
                opacity: isMouseOverGrid ? 1 : 0,
                filter: "blur(60px)",
                background:
                  "radial-gradient(circle at 50% 50%, #2CFF05, transparent 15rem)",
                transform: "translate(-50%, -50%)",
              }}
            ></div>

            <div className="relative z-10 flex justify-center gap-[2px]">
              <div className="top_row_empty_box h-[100px] w-[60px] bg-[#ffffff]"></div>
              <div className="top_row_empty_box h-[100px] w-[250px] bg-[#ffffff]"></div>
              <div className="top_row_empty_box h-[100px] w-[250px] bg-[#ffffff]"></div>
              <div className="top_row_empty_box h-[100px] w-[250px] bg-[#ffffff]"></div>
              <div className="top_row_empty_box h-[100px] w-[60px] bg-[#ffffff]"></div>
            </div>

            <div className="relative z-10 flex justify-center gap-[2px]">
              <div className="h-[250px] w-[60px] bg-[#ffffff]"></div>
              <div className="flex h-[250px] w-[250px] items-center justify-center bg-[#fff] duration-400 hover:bg-[#ffffffaa]">
                <img
                  src="/img/partner-logo1.png"
                  alt=""
                  className="mix-blend-luminosity"
                />
              </div>
              <div className="flex h-[250px] w-[250px] items-center justify-center bg-[#fff] duration-400 hover:bg-[#ffffffaa]">
                <img
                  src="/img/partner-logo2.png"
                  alt=""
                  className="mix-blend-luminosity"
                />
              </div>
              <div className="flex h-[250px] w-[250px] items-center justify-center bg-[#fff] duration-400 hover:bg-[#ffffffaa]">
                <img
                  src="/img/partner-logo3.png"
                  alt=""
                  className="mix-blend-luminosity"
                />
              </div>
              <div className="h-[250px] w-[60px] bg-[#ffffff]"></div>
            </div>

            <div className="relative z-10 flex justify-center gap-[2px]">
              <div className="top_row_empty_box h-[100px] w-[60px] bg-[#ffffff]"></div>
              <div className="top_row_empty_box h-[100px] w-[250px] bg-[#ffffff]"></div>
              <div className="top_row_empty_box h-[100px] w-[250px] bg-[#ffffff]"></div>
              <div className="top_row_empty_box h-[100px] w-[250px] bg-[#ffffff]"></div>
              <div className="top_row_empty_box h-[100px] w-[60px] bg-[#ffffff]"></div>
            </div>
          </div>
          <div className="pointer-events-none relative -top-[100px] z-[12] h-[100px] w-full bg-gradient-to-t from-white to-transparent"></div>{" "}
        </div>
      </section>
    </div>
  );
}

export default OurPartners;
