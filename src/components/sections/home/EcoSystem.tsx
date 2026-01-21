import React from "react";
import Link from "next/link";
function EcoSystem() {
  return (
    <div>
      <section className="relative overflow-hidden px-[20px] py-[40px] md:px-[30px] md:py-[70px] lg:px-[50px] lg:py-[100px] xl:pt-[113px] xl:pb-[137px]">
        <div className="absolute top-[22%] right-[16%] h-[50px] w-[50px] rounded-full bg-[#00B0B2] blur-xl"></div>
        <div className="move-lft absolute bottom-[25px] left-[42%] flex w-full justify-center">
          <div className="h-[50px] w-[50px] rounded-full bg-[#00B0B2] blur-xl"></div>
        </div>
        <div className="move-lft absolute right-[300px] bottom-[250px] flex w-full justify-center">
          <div className="h-[50px] w-[50px] rounded-full bg-[#00B0B2] blur-xl"></div>
        </div>
        <div className="container mx-auto">
          <div className="mx-auto max-w-[725px]">
            <h2 className="text-center text-[32px] text-[#052424] md:text-[45px] lg:text-[55px] xl:text-[77px]">
              Join the Nearhuman Ecosystem
            </h2>
          </div>

          <div className="mt-[37px] flex justify-center">
            <Link href="#" className="text-[16px] text-[#052424] underline hover:text-[#00B0B2]">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EcoSystem;
