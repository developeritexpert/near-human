import React from 'react'
import Link from 'next/link';
function EcoSystem() {
  return (
    <div>
        <section className='px-[20px] md:px-[30px] lg:px-[50px] py-[40px] md:py-[70px] lg:py-[100px] xl:pt-[113px] xl:pb-[137px] relative overflow-hidden'>
        
          <div className='bg-[#00B0B2] h-[50px] w-[50px] rounded-full blur-xl absolute top-[22%] right-[16%]'></div>
       
           <div className='absolute -z-1 top-[-70px] right-0 h-[426px] w-[524px]'>
             <img src="img/bg-line2.png" alt="" />
            </div>
            <div className="container mx-auto">
                <div className='max-w-[725px] mx-auto'>
                     <h2 className='text-[#052424]  text-center text-[32px] md:text-[45px] lg:text-[55px] xl:text-[77px] '>Join the Nearhuman Ecosystem</h2>
                </div>
                
                <div className="flex justify-center mt-[37px]">
                    <Link href="" className='text-[16px] text-[#052424] underline'>
                       Get in Touch                   
                    </Link>
                </div>
            </div>
            
        </section>
    </div>
  )
}

export default EcoSystem