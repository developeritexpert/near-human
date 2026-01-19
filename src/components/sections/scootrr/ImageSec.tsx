import React from 'react'

function ImageSec() {
  return (
    <div>
        <section className=" px-[20px] md:px-[30px] lg:px-[50px] relative after:absolute after:top-[217px] after:left-0 after:h-[974px] after:w-full after:content-[''] after:-z-1
                    after:bg-[url('/img/scooter-bgimg.png')] after:bg-cover after:bg-center after:no-repeat ">
           
            <div className="container max-w-[1440px] mx-auto">
                  <div>
                   <img src="img/Sctr-img-sec.png" alt="" className='object-cover rounded-[15px] md:rounded-[30px]'/>
                 </div>

            </div>
        </section>
    </div>
  )
}

export default ImageSec