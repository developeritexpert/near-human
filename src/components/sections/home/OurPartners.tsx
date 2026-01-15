import React from 'react'

function OurPartners() {
  return (
    <div>
        <section className='px-[20px] md:px-[30px] lg:px-[50px] pt-[40px] md:pt-[70px] lg:pt-[100px] xl:pt-[125px] pb-[100px]  md:pb-[150px] lg:pb-[200px] xl:pb-[318px] relative  overflow-hidden '>

<div className='move-lft absolute bottom-[25px] left-[42%] w-full'>
        <div className='  bg-[#00B0B2] h-[50px] w-[50px] rounded-full blur-xl '></div>
</div>

            <div className='absolute -z-1 bottom-[-200px] left-0 h-full max-h-[369px] w-full max-w-[821px]'>
             <img src="img/bg-line1.png" alt="" />
            </div>
           <div className="container mx-auto">
              <h1 className='text-[32px] sm:text-[38px]  md:text-[45px] lg:text-[55px] xl:text-[77px] text-[#101717] text-center '>Our Partners</h1>

                    <div className='flex flex-col sm:flex-row w-full h-full min-h-[400px] sm:min-h-[200px] lg:min-h-[290px]'>

                        <div className='flex-1 flex items-center justify-center border border-[#1017171a]'>

                            <img src="/img/partner-logo1.png" alt="" className='mix-blend-luminosity'/>
                        </div>

                        <div className='flex-1 flex items-center justify-center border-x sm:border-y  border-[#1017171a] '>
                            <img src="/img/partner-logo2.png" alt="" className='mix-blend-luminosity'/>
                        </div>

                        <div className='flex-1  flex items-center justify-center border border-[#1017171a]'>
                            <img src="/img/partner-logo3.png" alt="" className='mix-blend-luminosity'/>
                        </div>

                    </div>


            </div>
        </section>
    </div>
  )
}

export default OurPartners