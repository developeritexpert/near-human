"use client";
import AnimatedText from '@/components/layout/AnimationText';
import React from 'react'

function OurJourney() {
  return (
    <div>      
        <section className=' px-[20px] md:px-[30px] lg:px-[50px] pt-[62px] pb-[40px] md:pb-[70px] lg:pb[100px] xl:pb-[124px] overflow-hidden'>
            <div className="">
               <h5 className="text-[22px] md:text-[24px]  text-[#10171738] mb-[21px] text-center">Our Journey</h5>                 
                                    <AnimatedText
                                          text="NearHuman started in micromobility, solving real-world challenges with Scootrr:where latency, privacy,  and reliability matter."
                                          className="text-center text-[28px] leading-tight break-keep md:text-[36px] lg:text-[48px] xl:text-[57px] max-w-[1009px] mx-auto"
                                          fromColor="#10171730"
                                          toColor="#101717"
                                        />          

            </div>
        </section>             
    </div>
  )
}

export default OurJourney