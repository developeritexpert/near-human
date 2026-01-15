import React from 'react'
import Link from 'next/link'

function OurJourney() {
  return (
    <div>
        <section className='px-[20px] md:px-[30px] lg:px-[50px]  py-[40px] md:py-[70px] lg:pt-[100px] xl:pt-[127px] lg:pb-[100px] xl:pb-[26px]'>
            <div className="container mx-auto">
              <div className='max-w-[993px] mx-auto'>
                <h3 className='text-[28px] md:text-[35px] lg:text-[45px] xl:text-[55px] text-center'>
                    Our journey started with <span className='!font-bold'> Scootrr,</span> solving real world challenges
                    </h3>
               </div>
                <div className="flex  flex-wrap sm:flex-nowrap gap-4 mt-[60px] justify-center">
   
      <Link
        href="/early-access"
        className="rounded-lg border border-[#00B0B2] bg-[#00B0B2] w-full max-w-[170px] py-[18px] text-[16px] flex justify-center text-white transition hover:bg-white hover:text-[#101717] hover:border-[#101717]">
       MDP
      </Link>

      
      <Link
        href="/contact"
        className="rounded-lg border border-[#101717] w-full max-w-[170px] py-[18px] text-[16px] flex justify-center  text-[#101717] transition hover:bg-[#00B0B2] hover:text-[#fff] hover:border-[#00B0B2]">
        Scootrr
      </Link>

     
      <Link
        href="/explore"
        className="rounded-lg border border-[#101717] w-full max-w-[170px] py-[18px] text-[16px] flex justify-center text-[#101717] transition hover:bg-[#00B0B2] hover:text-[#fff] hover:border-[#00B0B2]">
       Contact us
      </Link>
                  </div>
            </div>
        </section>
    </div>
  )
}

export default OurJourney