import CTAbutton from '@/components/layout/CTAbutton';
import React from 'react'

function YourInsights() {
  const insightsData = [
  {
    id: 1,
    tag: "Announcement",
    title:
      "The Human Interface for AI: Why Interaction Matters as Much as Intelligence",
    desc:
      "If AI is going to live inside everyday devices, the interface can’t be an afterthought. Interaction design determines how humans...",
    image: "/img/your-insight-img1.png",
  },
  {
    id: 2,
    tag: "Announcement",
    title:
      "Rebuilding Trust in Technology Through Local, Transparent Systems",
    desc:
      "Trust in technology has eroded as data has moved farther away from users and into remote servers. Local intelligence offers...",
    image: "/img/your-insight-img2.png",
  },
  {
    id: 3,
    tag: "Announcement",
    title:
      "Why Data Gravity Is Pulling Intelligence Out of the Cloud and Into Devices",
    desc:
      "The data that matters most—in vehicles, homes, industrial equipment, and cities—is increasingly generated at the edge...",
    image: "/img/your-insight-img3.png",
  },
];
  return (
    <div>
        <section className='px-[20px] md:px-[30px] lg:px-[60px] py-[40px] md:pt-[80px] md:pb-[70px] lg:pb-[95px] '>

            <div className=''>
                <h2 className='text-[#052424]  text-center text-[32px] md:text-[45px] lg:text-[55px] xl:text-[77px] mb-[30px]'>Your Insights</h2>

            
              <div className="w-full flex flex-wrap lg:flex-nowrap items-center justify-center gap-[12px]">
  
            <CTAbutton
              href="/#"
              text="Topic"
             
            />
             <CTAbutton
              href="/#"
              text="Type: Blog"
             
            />


                      {/* <button className="h-[60px] w-[200px] rounded-[6px] border border-[#1017171A] px-[16px] text-[#101717] bg-white
                           flex items-center justify-center font-[450] cursor-pointer transition-colors duration-200 hover:border-[#000] text-[18px]">
                            Topic
                         </button>


                           <button className="h-[60px] w-[200px] rounded-[6px] border border-[#1017171A]  hover:border-[#000] px-[16px] text-[#101717] bg-white flex items-center justify-center
                                font-[450] cursor-pointer transition-all duration-200 ">
                                   Type: Blog
                                   </button> */}

                                <div className="flex ">
                                   <input  type="text" placeholder="Search: Blogs" className=" h-[60px] w-[60%] md:w-[320px] rounded-l-[6px] border border-[#1017171F] hover:border-[#000]
                                         px-[16px]  text-[#101717]  placeholder:text-[#10171773]  outline-none   transition-colors duration-200 "/>

  
                                  <button className="inline-block h-[60px] px-[32px] rounded-r-[6px] bg-[#00B0B2] text-white font-[450]  hover:bg-[#4FD6D8]
                                            transition-colors duration-300">
                                        Search
                                       </button>                                       
                                       
                                       </div>
               </div>
              
               <div className="mt-[60px] grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
  {insightsData.map((item) => (
    <div key={item.id} className="group">
      {/* IMAGE */}
      <div className="overflow-hidden rounded-[15px]">
        <img
          src={item.image}
          alt={item.title}
          className="
            w-full h-full object-cover
            transform transition-transform duration-500 ease-out
            group-hover:scale-110
          "
        />
      </div>

      {/* CONTENT */}
      <div className="mt-[20px]">
        <p className="text-[#00B0B2] text-[16px] font-[450] mb-[10px]">
          {item.tag}
        </p>

        <h4 className="text-[#101717] text-[24px] font-[450] mb-[8px] max-w-[532px] leading-snug">
          {item.title}
        </h4>

        <p className="text-[#10171773] text-[16px] font-medium max-w-[552px]">
          {item.desc}
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

export default YourInsights