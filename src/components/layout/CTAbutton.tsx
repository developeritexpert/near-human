import Link from "next/link";

interface CTAbuttonProps {
  href: string;
  text: string;
}

export default function CTAbutton({ href, text }: CTAbuttonProps) {
  return (
    <Link
      href={href}
      className="group relative block h-[56px] w-full max-w-[190px] overflow-hidden rounded-[7px] border border-[#727272] bg-white text-center text-[16px] text-black transition-colors duration-300 hover:border-[#00B0B2] hover:text-white hover:underline"
    >
      {/* Sliding background */}
      <span className="absolute inset-0 translate-y-full bg-[#00B0B2] transition-transform duration-300 ease-in-out group-hover:translate-y-0" />

      {/* Text */}
      <span className="relative z-10 flex h-full items-center justify-center">
        {text}
      </span>
    </Link>
  );
}
