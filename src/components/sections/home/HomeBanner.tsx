'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

function HomeBanner() {
  const ref = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 30%'],
  });

  const segments = [
    {
      text: 'The future isn’t more apps.',
      toColor: '#FFFFFF',
    },
    {
      text: ' It’s a conversation with the world around you.',
      toColor: '#00B0B2',
    },
  ];

  const fromColor = '#10171730';

  const fullText = segments.map(s => s.text).join('');
  const totalChars = fullText.replace(/\s/g, '').length;

  let charIndex = 0;

  return (
    <div>
        <section className="h-[70vh] md:h-[90vh] lg:h-[100vh] w-full px-[20px] md:px-[30px] lg:px-[50px] pb-[126px] relative">
        <div className='absolute inset-0 w-full h-full -z-1'>
            <img src="/img/home-banner.png" alt=""  className=' h-full w-full'/>
        </div>
           <div className="container h-full">
             <div className='h-full flex items-end'>
              {/* <h1 className='max-w-[1185px] text-[30px] sm:text-[35px]  md:text-[45px]  lg:text-[55px] xl:text-[70px] 2xl:text-[97px] !font-medium text-white'>
                        The future isn’t more apps. 
                      <span className='text-[#00B0B2]'> It’s a conversation with the world around you.</span>
             </h1> */}
 <h1
        ref={ref}
        className="max-w-[1200px] !font-medium leading-tight
          text-[30px] sm:text-[35px] md:text-[45px]
          lg:text-[55px] xl:text-[70px] 2xl:text-[97px]"
      >
        {segments.map((segment, segIndex) => (
          <span key={segIndex}>
            {segment.text.split(' ').map((word, wIndex) => (
              <span
                key={`${segIndex}-${wIndex}`}
                className="inline-flex whitespace-nowrap"
              >
                {word.split('').map((char, cIndex) => {
                  const start = charIndex / totalChars;
                  const end = start + 1 / totalChars;
                  charIndex++;

                  const color = useTransform(
                    scrollYProgress,
                    [start, end],
                    [fromColor, segment.toColor]
                  );

                  return (
                    <motion.span
                      key={`${segIndex}-${wIndex}-${cIndex}`}
                      style={{ color }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  );
                })}

                {/* space AFTER word */}
                <span className="inline-block">&nbsp;</span>
              </span>
            ))}
          </span>
        ))}
      </h1>


             </div>
          </div>
        </section>
    </div>
  )
}

export default HomeBanner