"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import CTAbutton from "./CTAbutton";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Scootrr", href: "/scootrr" },
    { name: "Our Work", href: "/#" },
    { name: "Blogs", href: "/blogs" },
  ];

  useEffect(() => {
    setMounted(true);

    // Only run scroll logic for homepage
    if (isHomePage) {
      const handleScroll = () => {
        const secondSection = document.querySelector(".second-sec");

        if (secondSection) {
          const rect = secondSection.getBoundingClientRect();
          const isInView =
            rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0;

          if (isInView && !hasScrolled) {
            setIsVisible(true);
            setHasScrolled(true);
          }

          // Optional: Hide navbar when scrolling back up before second section
          if (rect.top > window.innerHeight && hasScrolled) {
            setIsVisible(false);
            setHasScrolled(false);
          }
        }
      };

      // Check on initial load
      handleScroll();

      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    } else {
      // For non-home pages, navbar is always visible
      setIsVisible(true);
    }
  }, [hasScrolled, isHomePage]);

  // Reset when route changes
  useEffect(() => {
    if (isHomePage) {
      setIsVisible(false);
      setHasScrolled(false);

      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const secondSection = document.querySelector(".second-sec");
        if (secondSection) {
          const rect = secondSection.getBoundingClientRect();
          if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            setIsVisible(true);
            setHasScrolled(true);
          }
        }
      }, 100);
    } else {
      // For non-home pages, navbar is always visible
      setIsVisible(true);
    }
  }, [pathname]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Add CSS animation definitions inline if not in global CSS */}
      <style jsx global>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.7s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }

        .animate-slideDownMobile {
          animation: slideDown 0.3s ease-out forwards;
        }

        .animate-fadeInLeft {
          animation: fadeInUp 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }
      `}</style>

      <div
        className={`fixed top-[26px] left-0 z-50 flex w-full justify-center px-4 py-2 ${
          isHomePage
            ? isVisible
              ? "animate-slideDown opacity-100"
              : "pointer-events-none -translate-y-full opacity-0"
            : "opacity-100" // Always visible on non-home pages
        } transition-opacity duration-300`}
      >
        <nav className="relative flex h-[75px] w-full max-w-[1002px] items-center justify-between rounded-[15px] border border-white/10 bg-[#0b0f0f]/20 px-[20px] backdrop-blur-[34px]  lg:px-[60px]">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className=" flex-shrink-0">
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
          <div className="hidden items-center gap-5 lg:gap-10 md:flex">
  {navItems.map((item, index) => (
    <Link
      key={item.name}
      href={item.href}
      className={`text-[15px] leading-none font-bold tracking-normal transition-colors duration-300 ${
        pathname === item.href
          ? "text-[#00B0B2]"
          : "text-white/70 hover:text-white"
      } ${
        isHomePage
          ? isVisible
            ? "animate-fadeInUp"
            : "opacity-0"
          : "opacity-100"
      }`}
      style={{
        fontFamily: "var(--font-geist-sans), sans-serif",
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {item.name}
    </Link>
  ))}
</div>

          {/* Get In Touch Button */}
          <div className="md:block hidden basis-[20%]">
            <CTAbutton
              href="/contact"
              text="Get In Touch"
              svgColor="#00B0B2"
              textColor="text-[#fff]"
              hoverTextColor="hover:text-[#00B0B2]"
              borderColor="border-[#00B0B2]"
              bgColor="transparent"
            />
          </div>

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
            <div className="animate-slideDownMobile absolute top-full left-0 mt-4 flex w-full flex-col gap-6 rounded-2xl border border-white/10 bg-[#0b0f0f]/95 p-6 backdrop-blur-xl md:hidden">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`text-xl font-bold ${
                    pathname === item.href ? "text-white" : "text-white/70"
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
    </>
  );
}
