"use client"
import React from 'react'
import Link from 'next/link';
import CTAbutton from '@/components/layout/CTAbutton';
function Advisor() {
    const advisor = [
  {
    id: 1,
    name: "Mark Corderoy",
    designation: "Advisor",
   image: "img/advisor-img2.png",
  },
  {
    id: 2,
    name: "Charlie Hamilton*",
    designation: "Advisor",
    image: "img/advisor-img1.png",
  },
  {
    id: 3,
    name: "Cees De Witte",
    designation: "Advisor",
    image: "img/advisor-img3.png",
  },
 
];
  return (
    <div>
        <section className='px-[20px] md:px-[30px] lg:px-[50px] pt-[40px] md:pt-[70px] lg:pt-[100px] xl:pt-[135px]  pb-[40px] md:pb-[70px] lg:pb-[100px] xl:pb-[120px] relative overflow-hidden'>
           <div className="absolute top-0 left-0 w-full -z-1 h-full  max-h-[974px]">
                <img src="img/about-team-bg.png" alt="" className='object-contain h-full w-full' />
              </div>
              <div className="max-w-[1440px] mx-auto relative z-5">
                <h2 className='text-[35px] md:text-[40px] lg:text-[55px] xl:text-[77px] text-black text-center'>Advisors</h2>
                  <div className="mt-[50px]  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

                
               {advisor.map((item) => (
                   <div key={item.id} className="border-t border-l nth-[3n]:border-r nth-last-of-type-2:border-b nth-last-of-type-3:border-b last-of-type:border-r last-of-type:border-b border-[#1017171a] p-[17px] relative
            first:after:absolute
            first:after:content-['']
            first:after:left-[-7px]
            first:after:top-[-8px]
            first:after:w-[14px]
            first:after:h-[27px]
             first:after:bg-[url('/img/plus.svg')]
            first:after:bg-no-repeat
            first:after:bg-contain

            first:before:absolute
            first:before:content-['']
            first:before:right-[-7px]
            first:before:top-[-8px]
            first:before:w-[14px]
            first:before:h-[27px]
             first:before:bg-[url('/img/plus.svg')]
            first:before:bg-no-repeat
            first:before:bg-contain


               last:after:absolute
            last:after:content-['']
            last:after:left-[-7px]
            last:after:top-[-8px]
            last:after:w-[14px]
            last:after:h-[27px]
             last:after:bg-[url('/img/plus.svg')]
            last:after:bg-no-repeat
            last:after:bg-contain
            
             last:before:absolute
            last:before:content-['']
            last:before:right-[-7px]
            last:before:top-[-8px]
            last:before:w-[14px]
            last:before:h-[27px]
             last:before:bg-[url('/img/plus.svg')]
            last:before:bg-no-repeat
            last:before:bg-contain">
                  <img
                    src={item.image}
                     alt={item.name}
                         />
                     <div className="mb-[38px] mt-[55px]">
                         <h5 className="text-[22px] font-[450] text-center">
                         {item.name}
                           </h5>
                             <p className="text-center text-[16px] text-[#10171738]">
                                    {item.designation}
                                       </p>
                      </div>
                  </div>
             ))}


                  </div>
                  <div className="flex  flex-wrap sm:flex-nowrap gap-4 mt-[60px] justify-center">
   
     
             <CTAbutton
              href="/early-access"
              text="Join the early access"
             
            />
            <CTAbutton
              href="/contact"
              text="Talk to us"          
              
            />
            <CTAbutton
              href="/explore"
              text=" Explore Scootrr"            
             
            />
                  </div>

              </div>
        </section>
    </div>
  )
}

export default Advisor