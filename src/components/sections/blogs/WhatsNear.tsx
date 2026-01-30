"use client"
import React from 'react'
import Link from 'next/link';
import CTAbutton from '@/components/layout/CTAbutton';

function WhatsNear() {
  return (
    <div>
        <section className="px-[20px] md:px-[30px] lg:px-[60px] overflow-hidden">
            <div className="max-w-[1305px] mx-auto  relative  after:absolute after:content-[''] after:absolute after:inset-0
           after:bg-[url('/img/whatsnear-bg-img.png')] after:bg-cover after:bg-center after:-z-1  py-[50px] md:pt-[66px] md:pb-[70px] lg:pb-[100px] xl:pb-[143px]">
                 <h2 className='text-[#052424] font-medium text-center text-[32px] md:text-[45px] lg:text-[55px] xl:text-[77px] mb-[30px] max-w-[600px] mx-auto mb-[19px]'>
                     Be Part of
                     <span className='text-[#00B0B2]'> What’s Near.</span>
                  </h2>

                     <p className="text-[#10171773] text-[22px] font-medium max-w-[767px] mx-auto text-center">
                            From early experiments to real-world deployments, stay updated on how NearHuman 
                            is building the next era of intelligent devices.
                     </p>
                     <div className='mt-[39px] flex justify-center'>            
                         {/* <Link href="" className='inline-block text-[16px] bg-[#00B0B2] text-white font-[450] py-[16px] px-[32px] rounded-[7px] hover:bg-[#1FC4C6]'>
                          Join the Newsletter
                          </Link>                           */}
                             <CTAbutton
                                href="/#"
                              text="Join the Newsletter"
                                
                              />
                     </div>



            </div>
        </section>
    </div>
  )
}

export default WhatsNear