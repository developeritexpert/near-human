"use client"
import React from 'react'

function BlogGridSec() {
    const blogsData = [
  {
    id: 1,
    tag: "Blog",
    title: "The Coming Wave of Intelligent Consumer and Industrial Devices",
    desc: "Intelligence is no longer limited to high-end labs or enterprise environments. It’s emerging across mobility, logistics, cities, homes, and personal devices. We map the landscape of where...",
    image: "/img/blog-grid-img1.png",
  },
  {
    id: 2,
    tag: "Blog",
    title: "The Cloud Isn’t Going Away—But Its Role Is Changing Faster Than Expected",
    desc: "Cloud computing transformed software, but the next decade belongs to hybrid intelligence—where edge and cloud work together. We explore what workloads stay local, which remain cloud-based...",
    image: "/img/blog-grid-img2.png",
  },
  {
    id: 3,
    tag: "Blog",
    title: "The Engineering Shift Toward Onboard Intelligence",
    desc: "The gap between software intelligence and hardware capability is narrowing fast. As chip design, compute efficiency, and local AI models converge, devices are becoming decision-makers...",
    image: "/img/blog-grid-img3.png",
  },
  {
    id: 4,
    tag: "Blog",
    title: "Why True Autonomy Requires Context, Restraint, and Feedback",
    desc: "Automation is about execution; autonomy is about judgment. For intelligent systems to move into the real world, they must understand context, handle ambiguity, and know when not to act...",
    image: "/img/blog-grid-img4.png",
  },
];
  return (
    <div>
        <section className='px-[20px] md:px-[30px] lg:px-[60px]  py-[40px] md:pt-[70px] lg:pt-[90px] md:pb-[60px]'>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px] lg:gap-[40px]">
  {blogsData.map((item) => (
    <div key={item.id} className="group">
      
      <div className="rounded-[15px] overflow-hidden">
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

    
      <div className="mt-[30px]">
        <p className="text-[#4FD6D8] text-[16px] font-[450] mb-[15px]">
          {item.tag}
        </p>

        <h6 className="text-[#101717] text-[24px] font-[450] mb-[10px] leading-snug">
          {item.title}
        </h6>

        <p className="text-[#10171773] text-[16px] font-[450] max-w-[807px]">
          {item.desc}
        </p>
      </div>
    </div>
  ))}
</div>
        </section>
    </div>
  )
}

export default BlogGridSec