"use client"
import React from 'react'
 import Link from 'next/link';
import CTAbutton from '@/components/layout/CTAbutton';

function ContactForm() {
  return (
    <div>
        <section className="px-[20px] md:px-[30px] lg:px-[50px] py-[40px] md:py-[70px] lg:pt-[116px] lg:pb-[90px] relative after:absolute  after:h-full after:w-full after:content-[''] after:inset-0 after:bg-[url('/img/contactForm-bg-img.png')] bg-no-repeat bg-contain after:-z-10"> 
           
            <div className="max-w-[1350px] mx-auto">
              <div className="flex flex-col lg:flex-row gap-[30px] lg:gap-0">
                 <div className="flex-grow">
                    <div className=' lg:pr-[30px] xl:pr-[50px] 2xl:pr-[100px]'>
                        <h2 className='text-[#052424] font-medium text-[32px] md:text-[45px] lg:text-[55px] xl:text-[77px] mb-[12px] '>
                               Connect With Our Team     
                         </h2>
                         <p className='text-[#10171773] text-[20px] font-[450] '>
                            We’re here to answer questions, explore opportunities, and help you get the information you need.
                         </p>
                         <div className='border-b border-[#1017170F] my-[30px]'></div>

                         <div className='flex gap-[20px] mb-[30px]'>
                            <div className="h-[50px] w-[50px] bg-[#00B0B20F] rounded-[4px] flex justify-center items-center">
                              <svg width="13" height="18" viewBox="0 0 13 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6.49991 0C2.91057 0 0 2.98982 0 6.67689C0 11.0605 4.44513 16.1461 5.98361 17.7754C6.26619 18.0749 6.73381 18.0749 7.01639 17.7754C8.55469 16.1469 13 11.0605 13 6.67689C13 2.98982 10.0892 0 6.49991 0ZM6.49991 9.64439C4.90473 9.64439 3.61106 8.31549 3.61106 6.67689C3.61106 5.03828 4.90473 3.70938 6.49991 3.70938C8.09508 3.70938 9.38875 5.03828 9.38875 6.67689C9.38875 8.31642 8.09508 9.64439 6.49991 9.64439Z" fill="#00B0B2"/>
                               </svg>
                            </div>
                            <div>
                                <h6 className='text-[18px] md:text-[20px] text-[#101717] font-[450] mb-[3px]'>Address</h6>
                                <p className='text-[#10171773] text-[16px] font-[450]'>Launch Space,<br/> Bristol Robotics Lab, <br/> Bristol BS34 8RB</p>
                            </div>

                         </div>

                         <div className='flex gap-[20px] mb-[34px]'>
                            <div className="h-[50px] w-[50px] bg-[#00B0B20F] rounded-[4px] flex justify-center items-center">
                              <svg width="19" height="12" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1.38462 0C1.11246 0 0.862645 0.0817592 0.649038 0.216346L8.75481 7.1178C9.18611 7.48516 9.72184 7.48516 10.1538 7.1178L18.274 0.216346C18.0604 0.0817592 17.8106 0 17.5385 0H1.38462ZM0.0793269 0.930274C0.0299538 1.07289 0 1.22481 0 1.38462V10.6154C0 11.3824 0.617552 12 1.38462 12H17.5385C18.3055 12 18.9231 11.3824 18.9231 10.6154V1.38462C18.9231 1.22481 18.8931 1.07289 18.8438 0.930274L10.7524 7.81731C10.0022 8.45529 8.90631 8.45619 8.15625 7.81731L0.0793269 0.930274Z" fill="#00B0B2"/>
                               </svg>

                            </div>
                            <div>
                                <h6 className='text-[18px] md:text-[20px] text-[#101717] font-[450] mb-[3px]'>Email</h6>
                                <p className='text-[#10171773] text-[16px] font-[450]'>info@scootrr.comv</p>
                            </div>

                         </div>

                          <h6 className='text-[20px] text-[#00B0B2] font-[450] mb-[3px]'>Follow Us:</h6>
                          <div className='flex gap-[7px] mt-[11px]'>                                                    
                            <Link href="" className='h-[35px] w-[35px] flex justify-center items-center rounded-[2px] border border-[#0000000A] bg-[#10171705]'>
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.50312 1.17218C8.24269 1.17218 8.44844 1.17841 9.13429 1.20958C9.77026 1.24076 10.1132 1.34676 10.3439 1.43405C10.6494 1.55251 10.8614 1.69592 11.0921 1.92038C11.3228 2.15107 11.4599 2.36307 11.5784 2.66859C11.6657 2.89928 11.7717 3.24221 11.8029 3.87818C11.8341 4.56403 11.8403 4.76978 11.8403 6.50935C11.8403 8.24892 11.8341 8.45467 11.8029 9.14052C11.7717 9.7765 11.6657 10.1194 11.5784 10.3501C11.4599 10.6556 11.3165 10.8676 11.0921 11.0983C10.8676 11.3228 10.6494 11.4662 10.3439 11.5846C10.1132 11.6719 9.77026 11.7779 9.13429 11.8091C8.44844 11.8403 8.24269 11.8465 6.50312 11.8465C4.76355 11.8465 4.55779 11.8403 3.87194 11.8091C3.23597 11.7779 2.89304 11.6719 2.66234 11.5846C2.35683 11.4662 2.14483 11.3228 1.91414 11.0983C1.68344 10.8676 1.54627 10.6556 1.4278 10.3501C1.34051 10.1194 1.23453 9.7765 1.20335 9.14052C1.17218 8.45467 1.16594 8.24892 1.16594 6.50935C1.16594 4.76978 1.17218 4.56403 1.20335 3.87818C1.23453 3.24221 1.34051 2.89928 1.4278 2.66859C1.54627 2.36307 1.68967 2.15107 1.91414 1.92038C2.14483 1.68968 2.35683 1.55251 2.66234 1.43405C2.89304 1.34676 3.23597 1.24076 3.87194 1.20958C4.55779 1.17841 4.76355 1.17218 6.50312 1.17218ZM6.50312 0C4.73861 0 4.51415 0.00623349 3.82207 0.0374086C3.12998 0.0685836 2.65612 0.180808 2.24461 0.342918C1.81439 0.511264 1.45276 0.729497 1.09113 1.09113C0.729497 1.45276 0.505029 1.81438 0.342918 2.2446C0.180808 2.65611 0.0748187 3.12997 0.0374086 3.82206C0.00623349 4.51414 0 4.73861 0 6.50312C0 8.26762 0.00623349 8.49209 0.0374086 9.18417C0.0685836 9.87626 0.180808 10.3501 0.342918 10.7616C0.511264 11.1918 0.729497 11.5535 1.09113 11.9151C1.45276 12.2767 1.81439 12.5012 2.24461 12.6633C2.65612 12.8254 3.12998 12.9314 3.82207 12.9626C4.51415 12.9938 4.73861 13 6.50312 13C8.26762 13 8.49208 12.9938 9.18417 12.9626C9.87625 12.9314 10.3501 12.8192 10.7616 12.6633C11.1918 12.495 11.5535 12.2767 11.9151 11.9151C12.2767 11.5535 12.5012 11.1918 12.6633 10.7616C12.8254 10.3501 12.9314 9.87626 12.9688 9.18417C13 8.49209 13.0062 8.26762 13.0062 6.50312C13.0062 4.73861 13 4.51414 12.9688 3.82206C12.9376 3.12997 12.8254 2.65611 12.6633 2.2446C12.495 1.81438 12.2767 1.45276 11.9151 1.09113C11.5535 0.729497 11.1918 0.505029 10.7616 0.342918C10.3501 0.180808 9.87625 0.0748187 9.18417 0.0374086C8.49208 0.00623349 8.26762 0 6.50312 0Z" fill="#101717"/>
                                    <path d="M6.50311 3.16736C4.65755 3.16736 3.16113 4.66376 3.16113 6.50933C3.16113 8.35489 4.65755 9.85129 6.50311 9.85129C8.34868 9.85129 9.84507 8.35489 9.84507 6.50933C9.84507 4.66376 8.34868 3.16736 6.50311 3.16736ZM6.50311 8.67288C5.30599 8.67288 4.33332 7.70022 4.33332 6.5031C4.33332 5.30597 5.30599 4.33331 6.50311 4.33331C7.70023 4.33331 8.6729 5.30597 8.6729 6.5031C8.6729 7.70645 7.70023 8.67288 6.50311 8.67288Z" fill="#101717"/>
                                    <path d="M10.755 3.03642C10.755 3.46663 10.4059 3.81579 9.97567 3.81579C9.54545 3.81579 9.19629 3.46663 9.19629 3.03642C9.19629 2.6062 9.54545 2.25704 9.97567 2.25704C10.4059 2.25081 10.755 2.59997 10.755 3.03642Z" fill="#101717"/>
                                  </svg>


                            </Link>
                             <Link href="" className='h-[35px] w-[35px] flex justify-center items-center rounded-[2px] border border-[#0000000A] bg-[#10171705]'>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.71502 3.99976H0.238281V11.9946H2.71502V3.99976Z" fill="#101717"/>
                                <path d="M1.46284 2.95581C2.26992 2.95581 2.92568 2.29504 2.92568 1.47791C2.92568 0.660769 2.26992 0 1.46284 0C0.655759 0 0 0.660769 0 1.47791C0 2.29504 0.650715 2.95581 1.46284 2.95581Z" fill="#101717"/>
                                <path d="M6.668 7.80339C6.668 6.67856 7.18757 6.0077 8.17624 6.0077C9.08421 6.0077 9.52306 6.6483 9.52306 7.80339C9.52306 8.95344 9.52306 12.0001 9.52306 12.0001H11.9847C11.9847 12.0001 11.9847 9.07954 11.9847 6.93581C11.9847 4.79208 10.769 3.75806 9.07412 3.75806C7.37925 3.75806 6.66296 5.0796 6.66296 5.0796V4.00016H4.28711V11.995H6.66296C6.66801 12.0001 6.668 9.03414 6.668 7.80339Z" fill="#101717"/>
                              </svg>





                            </Link>

                             <Link href="" className='h-[35px] w-[35px] flex justify-center items-center rounded-[2px] border border-[#0000000A] bg-[#10171705]'>
                                <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M16.6681 1.87444C16.4708 1.13901 15.8969 0.556048 15.1614 0.358739C13.8341 -5.48363e-06 8.5112 0 8.5112 0C8.5112 0 3.18834 -5.48363e-06 1.86098 0.358739C1.13004 0.556048 0.55156 1.13453 0.35425 1.87444C-9.85464e-06 3.21076 0 6 0 6C0 6 -9.85464e-06 8.78923 0.35425 10.1256C0.55156 10.861 1.12556 11.4439 1.86098 11.6412C3.18834 12 8.5112 12 8.5112 12C8.5112 12 13.8341 12 15.1614 11.6412C15.8924 11.4439 16.4708 10.8655 16.6681 10.1256C17.0224 8.78923 17.0224 6 17.0224 6C17.0224 6 17.0224 3.21076 16.6681 1.87444Z" fill="#101717"/>
                                      <path d="M6.76953 8.52924V3.47095L11.218 6.0001L6.76953 8.52924Z" fill="white"/>
                                             </svg>



                            </Link>
                          </div>




                    </div>

                 </div>

                   <div className=" lg:basis-[550px] xl:basis-[650px] 2xl:basis-[730px] shrink-0 ">
                    <form className="w-full p-[20px] sm:p-[30px] md:p-[50px] rounded-[15px] border border-[#1017170F]">
 
  <div className="mb-[20px]">
    <label className="block text-[16px] md:text-[20px]  text-[#101717] mb-[6px]">
      Full Name
    </label>
    <input
      type="text"
      className="
        w-full h-[60px]
        rounded-[6px]
        border border-[#1017170F]
        px-[16px]
        outline-none
        focus:border-[#000]
        focus:ring-0
        transition-colors duration-200
      "
    />
  </div>

 
  <div className="mb-[20px]">
    <label className="block text-[16px] md:text-[20px]  text-[#101717] mb-[6px]">
      Email Address
    </label>
    <input
      type="email"
      className="
        w-full h-[60px]
        rounded-[6px]
        border border-[#1017171F]
        px-[16px]
        outline-none
        focus:border-[#000]
        focus:ring-0
        transition-colors duration-200
      "
    />
  </div>


  <div className="mb-[20px]">
    <label className="block text-[16px] md:text-[20px]  text-[#101717] mb-[6px]">
      Phone Number
    </label>
    <input
      type="tel"
      className="
        w-full h-[60px]
        rounded-[6px]
        border border-[#1017171F]
        px-[16px]
        outline-none
        focus:border-[#000]
        focus:ring-0
        transition-colors duration-200
      "
    />
  </div>


  <div className="mb-[20px]">
    <label className="block text-[16px] md:text-[20px]  text-[#101717] mb-[6px]">
      Company Name
    </label>
    <input
      type="text"
      className="
        w-full h-[60px]
        rounded-[6px]
        border border-[#1017171F]
        px-[16px]
        outline-none
        focus:border-[#000]
        focus:ring-0
        transition-colors duration-200
      "
    />
  </div>

  
  <div className="mb-[20px]">
    <label className="block  text-[16px] md:text-[20px] text-[#101717] mb-[6px]">
      Inquiry Type
    </label>
    <select
      className="
        w-full h-[60px]
        rounded-[6px]
        border border-[#1017171F]
        px-[16px]
        bg-white
        outline-none
        focus:border-[#000]
        focus:ring-0
        transition-colors duration-200
      "
    >
      <option>Select</option>
      <option>General</option>
      <option>Support</option>
      <option>Sales</option>
    </select>
  </div>

 
  <div className="mb-[25px]">
    <label className="block text-[16px] md:text-[20px]  text-[#101717] mb-[6px]">
      Message
    </label>
    <textarea
      className="
        w-full h-[130px]
        rounded-[6px]
        border border-[#1017171F]
        px-[16px] py-[12px]
        outline-none
        resize-none
        focus:border-[#000]
        focus:ring-0
        transition-colors duration-200
      "
    />
  </div>

            <CTAbutton
              href="/contact"
              text="Submit"
             
            />
  {/* <button
    type="submit"
    className="
       px-[42px] py-[16px]
      rounded-[6px]
      bg-[#00B0B2]
      text-white text-[16px] font-[#00B0B2]
      hover:bg-[#4FD6D8]
      transition-colors duration-300
    "  >
    Submit
  </button> */}
                     </form>

                   </div>
             </div>
            </div>
        </section>
    </div>
  )
}

export default ContactForm