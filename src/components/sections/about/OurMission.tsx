"use client";
import AnimatedText from '@/components/layout/AnimationText';
import React from 'react'

function OurMission() {
  return (
    <div>
        <section className=' px-[20px] md:px-[30px] lg:px-[50px] pt-[50px] md:pt-[70px] lg:pt-[100px] xl:pt-[148px] overflow-hidden'>
            <div className="max-w-[1305px] mx-auto bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0)_0%,#ffffff_100%)] pt-[50px] md:pt-[70px] lg:pt-[100px] xl:pt-[160px] pb-[50px] md:pb-[70px] lg:pb-[100px] xl:pb-[200px]
                    relative after:content-[''] after:absolute after:-left-[155px] after:bottom-[73px] after:w-[1564px] after:h-[1px]
                     after:bg-[linear-gradient(90deg,rgba(16,23,23,0)_0%,rgba(16,23,23,0.11)_50%,rgba(16,23,23,0)_100%)] ">
               <h5 className="text-[22px]  md:text-[24px]  text-[#10171738] mb-[21px] text-center">Our Mission</h5>
                <AnimatedText
                           text="To shape a new human era by redefining how we connect with the world."
                           className="text-center text-[28px] leading-tight break-keep md:text-[36px] lg:text-[48px] xl:text-[55px] max-w-[859px] mx-auto"
                           fromColor="#10171730"
                           toColor="#101717"
                         />

            </div>
        </section> 
            </div>
  )
}

export default OurMission