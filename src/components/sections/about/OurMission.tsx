"use client";
import AnimatedDirect from '@/components/layout/AnimatedDirect';
import React from 'react'

function OurMission() {
  return (
    <div>
        <section className=' px-[20px] md:px-[30px] lg:px-[50px] pt-[90px] h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] flex justify-center items-center overflow-hidden'>

            <div className="max-w-[1305px] mx-auto bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0)_0%,#ffffff_100%)] pt-[50px] md:pt-[70px] lg:pt-[100px] xl:pt-[160px] pb-[50px] md:pb-[70px] lg:pb-[100px] xl:pb-[200px]
                    relative after:content-[''] after:absolute after:-left-[155px]  after:bottom-0 lg:after:bottom-[73px] after:w-[1564px] after:h-[1px]
                     after:bg-[linear-gradient(90deg,rgba(16,23,23,0)_0%,rgba(16,23,23,0.11)_50%,rgba(16,23,23,0)_100%)] ">
               <h5 className="text-[22px]  md:text-[24px]  text-[#10171738] mb-[21px] text-center">Our Mission</h5>
                <AnimatedDirect
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


// "use client";

// import React, { useEffect, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import AnimatedText from "@/components/layout/AnimationText";

// gsap.registerPlugin(ScrollTrigger);

// function OurMission() {
//   const sectionRef = useRef<HTMLElement | null>(null);

//   useEffect(() => {
//     if (!sectionRef.current) return;

//     // Disable pin on mobile (important)
//     if (window.innerWidth < 1024) return;

//     const trigger = ScrollTrigger.create({
//       trigger: sectionRef.current,
//       start: "top top",
//       end: "+=400", // kitna scroll tak hold
//       pin: true,
//       pinSpacing: true,
//       anticipatePin: 1,
//     });

//     return () => {
//       trigger.kill();
//     };
//   }, []);

//   return (
//     <section
//       ref={sectionRef}
//       className="px-[20px] md:px-[30px] lg:px-[50px]
//                  pt-[50px] md:pt-[70px] lg:pt-[100px] xl:pt-[148px]
//                  overflow-hidden"
//     >
//       <div
//         className="max-w-[1305px] mx-auto
//         bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0)_0%,#ffffff_100%)]
//         pt-[50px] md:pt-[70px] lg:pt-[100px] xl:pt-[160px]
//         pb-[50px] md:pb-[70px] lg:pb-[100px] xl:pb-[200px]
//         relative
//         after:content-['']
//         after:absolute after:-left-[155px] after:bottom-[73px]
//         after:w-[1564px] after:h-[1px]
//         after:bg-[linear-gradient(90deg,rgba(16,23,23,0)_0%,rgba(16,23,23,0.11)_50%,rgba(16,23,23,0)_100%)]"
//       >
//         <h5 className="text-[22px] md:text-[24px] text-[#10171738] mb-[21px] text-center">
//           Our Mission
//         </h5>

//         <AnimatedText
//           text="To shape a new human era by redefining how we connect with the world."
//           className="text-center text-[28px] leading-tight break-keep
//                      md:text-[36px] lg:text-[48px] xl:text-[55px]
//                      max-w-[859px] mx-auto"
//           fromColor="#10171730"
//           toColor="#101717"
//         />
//       </div>
//     </section>
//   );
// }

// export default OurMission;
