const Footer = () => {
  return (
    <footer className="mt-[-1px] w-full border-t border-white/5 bg-[#050505] px-8 py-24 md:px-16">
      <div className="container-custom grid grid-cols-1 gap-20 md:grid-cols-4">
        <div className="col-span-1 md:col-span-2">
          <div className="mb-8 flex items-center gap-2">
            <span className="text-xl font-medium tracking-tight text-white/90">
              near
            </span>
            <span className="text-xl font-bold tracking-tight text-white uppercase">
              HUMAN
            </span>
          </div>
          <p className="max-w-xs text-[10px] leading-relaxed tracking-widest text-white/30 uppercase">
            Copyright Near Human © 2026
            <br />
            All Rights Reserved
          </p>
        </div>

        <div>
          <h4 className="mb-10 text-[10px] font-bold tracking-[0.4em] text-white uppercase">
            Quick Links
          </h4>
          <ul className="space-y-6 text-[10px] font-bold tracking-widest text-white/40 uppercase">
            <li>
              <a
                href="#"
                className="hover:text-primary transition-colors duration-300"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-primary transition-colors duration-300"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-primary transition-colors duration-300"
              >
                Scootrr
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-primary transition-colors duration-300"
              >
                Partners
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-primary transition-colors duration-300"
              >
                Blogs
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-primary transition-colors duration-300"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-10 text-[10px] font-bold tracking-[0.4em] text-white uppercase">
            Connect with our
            <br />
            experts today
          </h4>
          <ul className="space-y-6 text-[10px] font-bold tracking-widest text-white/40 uppercase">
            <li>
              <a
                href="#"
                className="hover:text-primary flex items-center gap-2 transition-colors duration-300"
              >
                <span className="text-[8px]">X</span> Twitter
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-primary flex items-center gap-2 transition-colors duration-300"
              >
                <span className="text-[8px]">f</span> Facebook
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-primary flex items-center gap-2 transition-colors duration-300"
              >
                <span className="text-[8px]">in</span> LinkedIn
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-primary flex items-center gap-2 transition-colors duration-300"
              >
                <span className="text-[8px]">ig</span> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
