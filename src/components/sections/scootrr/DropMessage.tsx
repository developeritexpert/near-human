import React from "react";
import Link from "next/link";
import CTAbutton from "@/components/layout/CTAbutton";

function DropMessage() {
  return (
    <div>
      <section className="relative px-[20px] py-[50px] md:px-[30px] md:py-[80px] lg:px-[50px] lg:pt-[121px] lg:pb-[137px]">
        <div className="absolute top-[22%] right-[16%] h-[50px] w-[50px] rounded-full bg-[#00B0B2] blur-xl"></div>

        <div className="absolute top-[-70px] right-0 -z-1 h-[426px] w-[524px]">
          <img src="img/bg-line2.png" alt="" />
        </div>
        <div className="Container mx-auto">
          <div className="">
            <h2 className="text-center text-[32px] text-[#052424] md:text-[45px] lg:text-[55px] xl:text-[77px]">
              We’d Love to Hear From You
            </h2>
            <p className="mx-auto mt-[10px] max-w-[725px] text-center text-[24px] font-[450] text-[#052424]">
              From product demos to partnership inquiries, drop us a message.
            </p>
          </div>
          <div className="mt-[37px] flex justify-center">
            <CTAbutton href="/contact" text="Send a Message" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default DropMessage;
