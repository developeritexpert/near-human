"use client";
import React from 'react'
import Link from 'next/link';
import { FaLinkedinIn } from "react-icons/fa";



function Team() {
const teamMembers = [
  {
    id: 1,
    name: "Faizan Mir",
    designation: "Founder & CEO",
    image: "img/abt-team-usr1.png",
    linkedin: "https://www.linkedin.com/in/faizanfaiiz/"
  },
  {
    id: 2,
    name: "Ali Ekbal",
    designation: "COO",
    image: "img/abt-team-usr2.png",
    linkedin: "https://www.linkedin.com/in/aliekbal/"
  },
  {
    id: 3,
    name: "Hatim Shaherawala",
    designation: "VP R&D",
    image: "img/abt-team-usr3.png",
    linkedin: "https://www.linkedin.com/in/hatim-shaherawala/"
  },
  {
    id: 4,
    name: "Dushyant Goel",
    designation: "AI R&D Intern",
    image: "img/abt-team-usr4.png",
    linkedin: "https://www.linkedin.com/in/dushyant-goel/"
  },
  {
    id: 5,
    name: "Madiha Trumboo",
    designation: "Finance Management",
    image: "img/abt-team-usr5.png",
    linkedin: "https://www.linkedin.com/in/madiha-trumboo/"
  },
  {
    id: 6,
    name: "Amin Alhawary",
    designation: "AI Engineer",
    image: "img/abt-team-usr6.png",
    linkedin: "https://www.linkedin.com/in/aminalhawary/"
  },
  {
    id: 7,
    name: "Cameron Setiadi",
    designation: "Legal Intern",
    image: "img/abt-team-usr7.png",
    linkedin: "https://www.linkedin.com/in/cameron-setiadi-5b49aa223/"
  },
  {
    id: 8,
    name: "Catherine Lau",
    designation: "Legal Intern",
    image: "img/abt-team-usr8.png",
    linkedin: "https://www.linkedin.com/in/catherine-lau-95b61a213/"
  },
];

  return (
    <div>
        <section className='px-[20px] md:px-[30px] lg:px-[50px] pt-[40px] md:pt-[70px] lg:pt-[90px] xl:pt-[107px]  pb-[40px] md:pb-[70px]  lg:pb-[100px] xl:pb-[140px] relative overflow-hidden'>            
              <div className="absolute top-0 left-0 w-full z-1 f-full max-h-[974px]">
                <img src="img/about-team-bg.png" alt="" />
              </div>
      
            <div className="max-w-[1440px] mx-auto relative z-5"> 
                <h2 className='text-[35px] md:text-[40px] lg:text-[55px] xl:text-[77px] text-center'>Team</h2>

              <div className="mt-[50px]  grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

                
               {teamMembers.map((item) => (
                   <div key={item.id} className="border-t border-l nth-[3n]:border-r nth-last-of-type-2:border-b nth-last-of-type-3:border-b last-of-type:border-r last-of-type:border-b border-[#1017171a] p-[17px]">
                  <div className='relative group'>
                  <img
                    src={item.image}
                     alt={item.name}
                        className="rounded-[20px] h-full w-full "
                         />     
                                          <Link
                                            href={item.linkedin}
                                            target="_blank"
                                            className="absolute bottom-[20px] left-[20px]
                                              inline-flex items-center justify-center
                                              py-3 px-3
                                              rounded-[6px]
                                              border border-black/20
                                              bg-white text-black
                                              overflow-hidden
                                              opacity-0 group-hover:opacity-100   
                                              transition-opacity duration-300
                                              hover:border-[#00B0B2]
                                              hover:text-white
                                              hover:[&_span.bg-slide]:translate-y-0">
                                            
                                            <span
                                              className="
                                                bg-slide
                                                absolute inset-0
                                                bg-[#00B0B2]
                                                translate-y-full
                                                transition-transform duration-300 ease-in-out
                                              "
                                            />
                                            <span className="relative z-10">
                                              <FaLinkedinIn />
                                            </span>
                                          </Link>
                        
                         </div>
                     <div className="mb-[38px] mt-[55px]">
                         <h5 className="text-[22px] font-[450] text-center">
                         {item.name}
                           </h5>
                             <p className="text-center text-[16px] text-[#10171738]">
                                    {item.designation}
                                       </p>
                      </div>
                  </div>
             ))}


               </div>
            </div>
        </section>
    </div>
  )
}

export default Team