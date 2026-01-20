"use client"
import React from 'react'
import Link from 'next/link';

function SideVideo() {
  return (
    <div>
        <section className='px-[20px] md:px-[30px] lg:px-[50px]  py-[40px] md:py-[70px] lg:pt-[90px] xl:pt-[140px] lg:pb-[100px] xl:pb-[150px]'>
        
             <div className="flex flex-col lg:flex-row ">
              <div className="flex-1 ">
                <div className=' xl:pl-[60px] 2xl:pl-[220px] lg:pt-[80px] xl:pt-[145px]  lg:mr-[30px] xl:mr-[80px] '>
                    <div>
                      <h2 className='mb-[4px] text-[32px] md:text-[45px] lg:text-[55px] xl:text-[77px] font-[450]'>30,000+</h2>
                      <p className='text-[22px] md:text-[25px] font-normal '>injuries in the UK and EU alone</p>        
                    </div>
                    <div className='mt-[40px] lg:mt-[90px]  lg:max-w-[412px] '>
                      <h2 className='mb-[4px] text-[32px] md:text-[45px] lg:text-[55px] xl:text-[77px] font-[450] text-[#1017171F]'>1,300</h2>
                      <p className='text-[22px] md:text-[25px]font-normal text-[#1017171F]  '>reported casualties in the UK alone, costing the NHS and Insurers ~£7M</p>        
                    </div>
                      <div className='mt-[40px] lg:mt-[90px]  lg:max-w-[412px] '>
                      <h2 className='mb-[4px] text-[32px] md:text-[45px] lg:text-[55px] xl:text-[77px] font-[450] text-[#1017171F]'>9,425</h2>
                      <p className=' text-[22px] md:text-[25px] font-normal text-[#1017171F]  '>Germany reported 9,425 E-Scooter accidents, marking a 14.1% increase from the previous year.</p>        
                    </div>
                    



                </div>                  
              </div>

             <div className="flex-1 relative z-10 h-full min-h-[400px] sm:min-h-[550px] md:min-h-[750px] lg:min-h-[833px] mt-[30px] lg:mt-0 flex justify-center items-center">
               <div className='absolute inset-0 -z-0 h-full w-full'>
                 <img src="/img/Sidevideo-bgimg.png" alt=""  className=' h-full w-full'/>
              </div>


                 <Link href="https://www.youtube.com/embed/sVHBuAOOHhE?autoplay=1&mute=1" className='relative z-20'>
                     <div className="h-[114px] w-[114px] rounded-full bg-[#00B0B21F]  flex justify-center items-center">
                         <div className='relative h-[80px] w-[80px] rounded-full bg-[#00B0B2]  flex justify-center items-center'>
                      <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M19.9287 9.3141C21.9287 10.4688 21.9287 13.3556 19.9287 14.5103L4.50013 23.4179C2.50013 24.5726 0.000136127 23.1293 0.000136228 20.8199L0.000137007 3.00448C0.000137108 0.695083 2.50014 -0.748288 4.50014 0.406412L19.9287 9.3141Z" fill="#101717"/>
                    </svg>
                   </div>
                 </div>
                      </Link>

               </div>
         </div>
     
        </section>
    </div>
  )
}

export default SideVideo