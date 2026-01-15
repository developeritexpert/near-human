
import AnimatedText from '@/components/layout/AnimationText'
import React from 'react'

function Posibilities() {
const deviceCategories = [
  {
    id: "01",
    title: "Accessibility and assistive devices",
  },
  {
    id: "02",
    title: "Personal consumer devices",
  },
  {
    id: "03",
    title: "Smart home ecosystems",
  },
  {
    id: "04",
    title: "Vehicles and mobility",
  },
  {
    id: "05",
    title: "Wearables and ambient companions",
  },
  {
    id: "06",
    title: "Industrial + frontline tools",
  },
];

  return (
    <div>
        <section className='px-[20px] md:px-[30px] lg:px-[50px] pt-[40px] md:pt-[70px] lg:pt-[90px] xl:pt-[125px] pb-[40px] md:pb-[70px] lg:pb-[100px] xl:pb-[170px]'>
          <div className='max-w-[746px] mx-auto text-center '>
            
         <AnimatedText
            text="Today, AI has no standard way to talk to the hardware devices"
          className="  text-[32px] md:text-38px] lg:text-[55px] text-center  break-keep"
           fromColor="#10171730"
            toColor="#101717"/>           
           </div>

            <div className="flex flex-col lg:flex-row 2xl:items-center mt-[106px]">

              <div className="flex-1 lg:pr-[20px]  xl:pl-[60px] 2xl:pl-[240px]">
                <h3 className=' text-[32px]  md:text-[42px] lg:text-[54px] text-[#101717] !font-semibold'>Possibilities are Endless</h3>

                 <div className=' mt-[30px] lg:mt-[45px] pl-10px md:pl-[29px] h-[300px] overflow-y-scroll  scrollbar-hidden'>
                   

                          <div className="flex flex-col">
                             {deviceCategories.map((item) => (
                             <div key={item.id} className="flex gap-3 mt-[45px]">    
                             <p className="text-[#2A3B3A80] text-[16px] font-medium">{item.id}</p>
      
                                 <h5 className={`text-[#101717] text-[25px] sm:text-[28px] md:text-[36px] xl:text-[45px] font-[450] leading-[1.1]
                                         ${item.id === "01" ? "lg:max-w-[373px]" : ""}
                                          ${item.id === "05" ? "lg:max-w-[450px]" : ""}
                                                       `} >
                                                {item.title}
                                  </h5>
                                 </div>
                                      ))}
                           </div>





                 </div>

              </div>              
              <div className="flex-1 py-[50px] sm:p-[80px] lg:p-0 pl-[20px] w-full  xl:min-h-[600px] 2xl:min-h-[833px]  relative flex justify-center items-center mt-[50px] lg:mt-0" >
               
                <div className='absolute inset-0 h-full w-full -z-1'>
                  <img src="/img/posibili-bg-img1.png" alt="" className='h-full w-full'/>
                </div>

                <div className="">
                  <img src="/img/posibili-img1.png" alt="" className='object-contain  lg:max-w-[300px]  xl:max-w-[400px] 2xl:max-w-full ' />
                </div>
               
               
              </div>

            </div>
  


        </section>        
    </div>
  )
}

export default Posibilities