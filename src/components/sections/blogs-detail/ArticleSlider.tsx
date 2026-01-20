"use client";

import Slider from "react-slick";
import { useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from 'next/link';


function ArticleSlider() {
     
    
      const settings = {
        arrows: false, 
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1024,
            settings: { slidesToShow: 2 },
          },
          {
            breakpoint: 680,
            settings: { slidesToShow: 1 },
          },
        ],
      };
    
    
    
    
      const latestNews = [
      {
        id: 1,
        type: "Announcement",
        date: "Jan 8, 2026",
        title: "How Micromobility Shaped a Broader Vision for Intelligence",
        bgImage: "/img/latest-slider-bg1.png",
      },
      {
        id: 2,
        type: "Announcement",
        date: "Jan 3, 2026",
        title: "Why the Future of Intelligent Devices Depends on the Edge",
        bgImage: "/img/latest-slider-bg1.png",
      },
      {
        id: 3,
        type: "Announcement",
        date: "Dec 22, 2025",
        title: "Latency as a Design Constraint: Why Speed Still Defines User Trust",
        bgImage: "/img/latest-slider-bg1.png",
      },
    
    // duplicate 
        {
        id: 4,
        type: "Announcement",
        date: "Jan 8, 2026",
        title: "How Micromobility Shaped a Broader Vision for Intelligence",
        bgImage: "/img/latest-slider-bg1.png",
      },
     
    ];
  return (
    <div>
         <section className='px-[10px] sm:px-[20px] md:px-[30px] lg:px-[60px] pb-[40px] md:pb-[70px]  lg:pb-[100px] xl:pb-[120px]'>
            <div className="absolute inset-0 -z-10">
                <img src="/img/blg-detl-slider-bg.png" alt="" />
            </div>
            <div>        

         <div className=" article_slider w-full mx-auto   mt-[30px] md:mt-[59px]">
         <Slider  {...settings}>
          {latestNews.map((item) => (
           <div key={item.id} className="px-3">
        <div
          className="
            group relative h-full min-h-[450px] md:min-h-[450px] lg:min-h-[653px] rounded-[10px] sm:rounded-[17px]
            bg-[#10171705]
            hover:bg-white
            overflow-hidden
            transition-colors duration-500  ">
          
          <div   className="
              absolute inset-0              
              opacity-0 group-hover:opacity-100
              transition-opacity duration-500
              bg-contain  bg-no-repeat
               h-full w-full
            "
            style={{ backgroundImage: `url(${item.bgImage})` }}
          />

          
     
         
          <div className="relative z-10 flex flex-col h-full min-h-[450px] md:min-h-[450px] lg:min-h-[653px]  px-[15px] py-[25px] sm:p-[35px] md:pt-[30px]">
            <div className="flex justify-between w-full">
              <p className="text-[18px] text-[#00B0B2] font-[450]">
                {item.type}
              </p>
              <p className="text-[18px] text-[#101717] group-hover:text-white font-[450] transition-colors duration-300">
                {item.date}
              </p>
            </div>

            <div className="max-w-[398px] mt-[16px]">
              <h4 className=" text-[24px] sm:text-[28px] md:text-[30px] lg:text-[36px] text-[#101717] group-hover:text-white font-[450] transition-colors duration-300">
                {item.title}
              </h4>
            </div>

         
            <div className="mt-auto  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Link
                href="#"
                className="
                  inline-block text-[16px] text-white
                  border border-white
                  py-[13px] px-[34px]
                  rounded-[7px]
                "
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </div>
    ))}
  </Slider>
</div>




            </div>
        </section>
    </div>
  )
}

export default ArticleSlider