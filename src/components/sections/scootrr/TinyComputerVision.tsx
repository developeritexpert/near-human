import React from 'react'

function TinyComputerVision() {
  return (
    <div>
        <section className="px-[20px] md:px-[30px] lg:px-[50px] pt-[50px] md:pt-[90px] lg:pt-[110px] pb-[120px]  md:pb-[220px] lg:pb-[320px] xl:pb-[420px] relative  "> 
                     <div className='absolute top-0 bottom-0 left-0 right-0 z-0'>
                      <img src="/img/tiny-comp-bg-img.png" alt=""  className='object-contain '/>
                      </div>          
           <div className='absolute top-[50px] left-0 bottom-0 right-0 -z-10  bg-[#0A1016]'></div>
            <div className="container max-w-[1440px] mx-auto relative z-10">
                <div className='max-w-[760px] mx-auto'>
                  <h3 className='text-[28px]  sm:text-[32px] md:text-[45px] lg:text-[57px] text-[#FFF] text-center font-[450]'>Tiny Computer Vision Camera module 
                    <span className='text-[#00B0B2]'> packed with features</span>
                   </h3>
               </div>
               <div className="mt-[40px] md:mt-[60px] lg:mt-[107px] flex justify-center">
                <div>
                   <div className="h-[43px] w-[43px] border border-[#00B0B2] rounded-full flex justify-center items-center text-[#00B0B2]">
                    1
                   </div>
                     <p className='mt-[19px] max-w-[359px] text-[26px] font-[450] text-white'>Safety Features that redefine micromobility</p>
                </div>
               </div> 
            </div>
        </section>
    </div>
  )
}

export default TinyComputerVision