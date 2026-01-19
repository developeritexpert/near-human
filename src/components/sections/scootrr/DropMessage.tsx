import React from 'react'
import Link from 'next/link'

function DropMessage() {
  return (
    <div>
          <section className='px-[20px] md:px-[30px] lg:px-[50px] py-[50px] md:py-[80px] lg:pt-[121px] lg:pb-[137px] relative'>
             <div className='bg-[#00B0B2] h-[50px] w-[50px] rounded-full blur-xl absolute top-[22%] right-[16%]'></div>
       
           <div className='absolute -z-1 top-[-70px] right-0 h-[426px] w-[524px]'>
             <img src="img/bg-line2.png" alt="" />
            </div>
       <div className="Container mx-auto">

          <h5 className='text-[24px] font-[450] text-[#10171738] text-center'>Scootrr</h5>
           
           <div className='max-w-[725px] mx-auto'>
             <h2 className='text-[#052424]  text-center text-[32px] md:text-[45px] lg:text-[55px] xl:text-[77px] '>We’d Love to Hear From You</h2>
          <p className='text-[#052424] text-[24px] font-[450] text-center'>From product demos to partnership inquiries, drop us a message and we’ll get back quickly.</p> 
           </div>
           <div className="flex justify-center mt-[37px]">
                    <Link href="" className='text-[16px] text-[#052424] underline'>
                     Send a Message                 
                    </Link>
                </div>
           
        </div>
   </section>
    </div>
  )
}

export default DropMessage