"use client"
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

function BlogGridSec() {
  const blogsData = [
    {
      id: 1,
      tag: "Blog",
      title: "The Coming Wave of Intelligent Consumer and Industrial Devices",
      desc: "Intelligence is no longer limited to high-end labs or enterprise environments. It's emerging across mobility, logistics, cities, homes, and personal devices. We map the landscape of where...",
      image: "/img/blog-grid-img1.png",
    },
    {
      id: 2,
      tag: "Blog",
      title: "The Cloud Isn't Going Away—But Its Role Is Changing Faster Than Expected",
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
  ]

  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!sectionRef.current) return

    // Staggered card entrance animation
    gsap.fromTo(
      cardRefs.current,
      {
        opacity: 0,
        y: 50,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none none",
        },
      }
    )

    // Hover animations for cards
    cardRefs.current.forEach((card, index) => {
      if (!card) return

      const img = card.querySelector('img')
      const title = card.querySelector('h6')
      const desc = card.querySelector('p:nth-of-type(2)')

      // Hover in
      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -10,
          scale: 1.02,
          duration: 0.4,
          ease: "power2.out",
        })

        gsap.to(img, {
          scale: 1.15,
          duration: 0.6,
          ease: "power2.out",
        })

        gsap.to(title, {
          color: "#4FD6D8",
          duration: 0.3,
        })

        // Staggered text animation
        gsap.fromTo([title, desc],
          { y: 0 },
          { y: -5, duration: 0.3, stagger: 0.1 }
        )
      }

      // Hover out
      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        })

        gsap.to(img, {
          scale: 1.1,
          duration: 0.6,
          ease: "power2.out",
        })

        gsap.to(title, {
          color: "#101717",
          duration: 0.3,
        })

        gsap.to([title, desc], {
          y: 0,
          duration: 0.3,
        })
      }

      card.addEventListener('mouseenter', handleMouseEnter)
      card.addEventListener('mouseleave', handleMouseLeave)

      // Cleanup event listeners on component unmount
      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter)
        card.removeEventListener('mouseleave', handleMouseLeave)
      }
    })

    // Cleanup GSAP animations
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  // Function to set refs without returning a value
  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[index] = el
  }

  return (
    <div ref={sectionRef}>
      <section className='px-[20px] md:px-[30px] lg:px-[60px] py-[40px] md:pt-[70px] lg:pt-[90px] md:pb-[60px]'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px] lg:gap-[40px]">
          {blogsData.map((item, index) => (
            <div 
              key={item.id} 
              ref={setCardRef(index)}
              className="group cursor-pointer relative overflow-hidden"
            >
              {/* Card background with subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[15px] z-10" />
              
              {/* Image container with clip-path effect */}
              <div className="rounded-[15px] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                
                <img
                  src={item.image}
                  alt={item.title}
                  className="
                    w-full h-full object-cover
                    transform transition-transform duration-700 ease-out
                    group-hover:scale-110
                    min-h-[300px] md:min-h-[350px]
                  "
                />
                
                {/* Tag overlay with animation */}
                <div className="
                  absolute top-4 left-4 z-20
                  bg-[#4FD6D8] text-white px-4 py-2 rounded-full
                  transform -translate-x-10 opacity-0
                  group-hover:translate-x-0 group-hover:opacity-100
                  transition-all duration-500 ease-out
                ">
                  <span className="text-sm font-medium">{item.tag}</span>
                </div>
              </div>

              {/* Content container */}
              <div className="mt-[30px] relative z-20">
                <p className="text-[#4FD6D8] text-[16px] font-[450] mb-[15px] transform transition-transform duration-300 group-hover:translate-x-2">
                  {item.tag}
                </p>

                <h6 className="text-[#101717] text-[24px] font-[450] mb-[10px] leading-snug transition-all duration-300">
                  {item.title}
                </h6>

                <p className="text-[#10171773] text-[16px] font-[450] max-w-[807px] transition-all duration-300">
                  {item.desc}
                </p>
                
                {/* Read more indicator */}
                <div className="mt-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-[#4FD6D8] text-sm font-medium">Read more</span>
                  <svg 
                    className="w-4 h-4 text-[#4FD6D8] transform transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              {/* Bottom border effect */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#4FD6D8] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          ))}
        </div>

        {/* Animated separator between rows */}
        <div className="mt-[60px] relative">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <div className="
            absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            w-32 h-1 bg-gradient-to-r from-transparent via-[#4FD6D8] to-transparent
            animate-pulse
          " />
        </div>
      </section>
    </div>
  )
}

export default BlogGridSec