"use client"
import React from 'react'
  import Link from 'next/link';
import CTAbutton from '@/components/layout/CTAbutton';

function WhyReliability() {
  return (
    <div>
        <section className='px-[20px] md:px-[30px] lg:px-[60px]'>
           <div className="flex gap-[60px] flex-col lg:items-center lg:flex-row  ">
            <div className="rounded-[15px] overflow-hidden">
                <img src="/img/blog-realibility-img.png" alt="" />
            </div>
            <div className="">
              <p className='text-[#00B0B2] text-[16px] font-[450] mb-[12px]'>Blogs</p>
              <p className='text-[#9F9F9F] text-[16px] font-[450] mb-[17px]'>Nov 27, 2025</p>
              <h4 className='text-[#101717] text-[28px] md:text-[32px] lg:text-[38px] font-[450] mb-[13px] max-w-[653px]'>
                Real-World AI Is Hard: Why Reliability Outweighs Novelty in Everyday Devices
              </h4>
               <p className='text-[#9F9F9F] text-[18px] font-medium mb-[37px]  max-w-[660px]'>
                   Most AI systems work in controlled demos or sandbox environments. The real challenge begins when 
              unpredictable conditions, network limitations, and safety expectations collide. We unpack what 
              reliability truly means and why it’s the hidden backbone of intelligent devices.
               </p>

               <div> 
                  <CTAbutton
                    href="/blod-details"
                    text="Read More"
                    svgColor="#00B0B2"
                    textColor="text-[#fff]"
                    hoverTextColor="hover:text-[#000]"
                    borderColor="border-[#00B0B2]"
                    bgColor="transparent"
                  />           
               </div>
            </div>
           </div>
        </section>
    </div>
  )
}

export default WhyReliability