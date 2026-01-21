// components/CTAButtonTailwind.tsx
import React from "react";
import Link from "next/link";

interface CTAbuttonProps {
  href: string;
  text: string;
  svgColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  borderColor?: string;
  bgColor?: string;
}

const CTAbutton: React.FC<CTAbuttonProps> = ({
  href,
  text,
  svgColor = "#00B0B2",
  textColor = "text-white",
  hoverTextColor = "text-black",
  borderColor = "border-[#00B0B2]",
  bgColor = "bg-[#fff]",
}) => {
  return (
    <Link
      href={href}
      className={`group block relative h-[56px] w-full max-w-[170px] overflow-hidden rounded-[7px] border py-[15px] text-center text-[16px] transition-all delay-500 duration-400 ease-in ${bgColor} ${borderColor} ${textColor} ${hoverTextColor} `}
    >
      {/* Top SVG */}
      <div className="pointer-events-none absolute right-0 bottom-[45%] left-0 z-1 transition-all delay-500 duration-400 ease-in-out group-hover:bottom-[90%]">
        <svg
          width="170"
          height="32"
          viewBox="0 0 170 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-colors delay-500 duration-400 ease-in-out"
        >
          <path
            d="M140 32.001H30L20 28.001H0V7.00098C0 3.13504 3.13409 9.90657e-05 7 0H163C166.866 0 170 3.13498 170 7.00098V28.001H150L140 32.001Z"
            className="transition-colors delay-500 duration-400 ease-in-out"
            fill={svgColor}
          />
        </svg>
      </div>

      <span className="relative z-2 block">{text}</span>

      {/* Bottom SVG */}
      <div className="pointer-events-none absolute top-[45%] right-0 left-0 z-1 transition-all delay-500 duration-400 ease-in-out group-hover:top-[90%]">
        <svg
          width="170"
          height="32"
          viewBox="0 0 170 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-colors delay-500 duration-400 ease-in-out"
        >
          <path
            d="M170 0V25.001C170 28.8669 166.866 32.001 163 32.001H7C3.13418 32.0009 0.000141536 28.8668 0 25.001V0H170ZM20 0.000976562L30 4.21582H140L150 0.000976562H20Z"
            className="transition-colors delay-500 duration-400 ease-in-out"
            fill={svgColor}
          />
        </svg>
      </div>
    </Link>
  );
};

export default CTAbutton;
