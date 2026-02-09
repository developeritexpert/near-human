import Link from "next/link";

interface CTAbuttonProps {
  href: string;
  text: string;
}

export default function CTAbuttonNav({ href, text }: CTAbuttonProps) {
  return (
    <Link
      href={href}
      className="group relative block flex h-[45px] w-full max-w-[120px] items-center justify-center overflow-hidden rounded-[7px] bg-white text-black transition-colors duration-300 hover:text-white hover:underline"
    >
      {/* black sliding background */}
      <span className="absolute inset-0 translate-y-[101%] bg-[#00B0B2] transition-transform duration-300 ease-in-out group-hover:translate-y-0" />

      {/* text */}
      <span className="relative z-10 text-[15px]">{text}</span>
    </Link>
  );
}
