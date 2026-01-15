"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Scootrr", href: "/scootrr" },
    { name: "Our Work", href: "/work" },
    { name: "Blogs", href: "/blogs" },
  ];

  return (
    <div className="fixed top-[26px] left-0 z-50 flex w-full justify-center px-4 py-2">
      <nav
        className="
          relative flex h-[75px] w-[1002px] items-center justify-between
          px-[20px] md:px-[60px]
          rounded-[15px]

          /* 🔥 key change */
          bg-[#0b0f0f]/20
          backdrop-blur-[34px]

          border border-white/10
          /*shadow-[0_10px_40px_rgba(0,0,0,0.25)]*/
        "
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="ml-4 flex-shrink-0">
            <Image
              src="/img/white-logo.png"
              alt="near HUMAN"
              width={170}
              height={19}
              className="h-[19px] w-[170px] object-contain"
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-[15px] leading-none font-bold tracking-normal transition-all duration-300
                ${
                  pathname === item.href
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                }
              `}
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Get In Touch Button */}
        <Link
          href="/contact"
          className="
            mr-4 hidden md:flex h-[42px] w-[127px]
            items-center justify-center rounded-[7px]
            bg-[#00B0B2]
            text-[15px] font-[450] text-white
            shadow-[0_0_20px_rgba(0,176,178,0.25)]
            transition-all hover:brightness-110 active:scale-95
          "
        >
          Get In Touch
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 text-white md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Mobile Navigation Dropdown */}
        {open && (
          <div className="
            absolute top-full left-0 mt-4
            flex w-full flex-col gap-6
            rounded-2xl
            bg-[#0b0f0f]/95
            border border-white/10
            p-6 backdrop-blur-xl md:hidden
          ">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`text-xl font-bold ${
                  pathname === item.href
                    ? "text-white"
                    : "text-white/70"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="flex h-[48px] w-full items-center justify-center rounded-[7px] bg-[#00B0B2] text-[15px] font-medium text-white"
            >
              Get In Touch
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
