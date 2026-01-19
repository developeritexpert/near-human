'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);


function VehicleTechStack() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement[]>([]);

  const slides = [
    { id: 1, src: '/img/Scootr-slidr-img2.png', alt: 'Scooter image 1' },
    { id: 2, src: '/img/Scootr-slidr-img1.png', alt: 'Scooter image 2' },
    { id: 3, src: '/img/Scootr-slidr-img3.png', alt: 'Scooter image 3' },
  ];
  
 useEffect(() => {
  const ctx = gsap.context(() => {
    const positions = {
      left:   { x: -320, scale: 0.7, opacity: 0.3 },
      center: { x: 0,    scale: 1,   opacity: 1 },
      right:  { x: 320,  scale: 0.7, opacity: 0.3 },
    };

    let slots = [...imagesRef.current];

    // initial placement
    gsap.set(slots[0], positions.left);
    gsap.set(slots[1], positions.center);
    gsap.set(slots[2], positions.right);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${(slides.length - 1) * 100}%`, // 🔑 FIX
        scrub: 1.2,
        pin: true,
      },
    });

    // EXACT number of moves
    for (let step = 0; step < slides.length - 1; step++) {
      tl.to(slots[2], { ...positions.center, duration: 1 }, `step-${step}`);
      tl.to(slots[1], { ...positions.left, duration: 1 }, `step-${step}`);
      tl.to(slots[0], { ...positions.right, duration: 1 }, `step-${step}`);

      // rotate slots
      slots = [slots[1], slots[2], slots[0]];
    }
  }, sectionRef);

  return () => ctx.revert();
}, []);






  return (
   <section
      ref={sectionRef}
      className="gsap-sec px-[20px] md:px-[30px] lg:px-[50px]
        pt-[50px] md:pt-[70px] lg:pt-[100px] xl:pt-[136px]"
    >
      <div className="container mx-auto">
        <div className="max-w-[730px] mx-auto">
          <h2 className="text-[32px] md:text-[42px] lg:text-[55px] xl:text-[77px]
            text-[#101717] font-[450] text-center">
            Seamless Retrofitting with your vehicle
            <span className="text-[#00B0B2]"> tech stack.</span>
          </h2>
        </div>

        <div className=" max-w-[1060px] mx-auto mb-[106px] overflow-hidden" >
 <div className="relative h-[350px] sm:h-[400px]  lg:h-[500px] flex items-center justify-center overflow-hidden">
  {slides.map((item, i) => (
    <div
      key={item.id}
      ref={(el) => {
        if (el) imagesRef.current[i] = el;
      }}
      className="absolute flex justify-center items-center"
    >
      <Image
        src={item.src}
        alt={item.alt}
        width={500}
        height={500}
        className="scooter-img"
      />
    </div>
  ))}
</div>


        </div>

        <div className="border border-transparent
          [border-image-source:linear-gradient(90deg,rgba(16,23,23,0)_0%,rgba(16,23,23,0.11)_50%,rgba(16,23,23,0)_100%)]
          [border-image-slice:1]"
        />
      </div>
    </section>
  )
}

export default VehicleTechStack