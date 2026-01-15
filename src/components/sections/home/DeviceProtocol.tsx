import React from 'react'

function DeviceProtocol() {
  return (
    <div>
        <section className='px-[20px] md:px-[30px] lg:px-[50px] h-[70vh] md:h-[90vh] lg:h-[100vh] relative '>
        <div className='absolute inset-0 w-full h-full -z-1'>
            <img src="img/device-proto-img1.png" alt=""  className=' h-full w-full'/>
        </div>
            <div className=' absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1'>
            <img src="/img/device-proto-bg.png" alt="" />
            </div>

            <div className="container mx-auto h-full flex justify-center items-center">
                <div className='relative z-5'>
            <h3 className=' text-[25px] md:text-[32px] lg:text-[38px] xl:text-[45px] text-White mb-[19px] text-center text-white'>That's the</h3>
            <h2 className=' text-[32px] sm:text-[38px] md:text-[50px] lg:text-[80px] xl:text-[110px] text-white !font-medium text-center'>Model to Device Protocol</h2>
            </div>
            </div>
        </section>
    </div>
  )
}

export default DeviceProtocol