const Footer = () => {
  return (
    <footer className=" w-full border-none py-[50px] md:py-[90px] lg:pt-[140px] md:pb-[70px] lg:pb-[160px] px-[20px] md:px-[30px] lg:px-[50px]  bg-white relative overflow-hidden ">
      <div className="absolute inset-0 z-1 ">
        <img src="img/footer-bg.png" alt="" className="object-cover md:object-fill w-full h-full" />
      </div>
      
       <div className="absolute top-[40px] left-0 bg-[url('/img/footr-bg-shade.png')] h-[369px] w-[821px] z-2 "></div>
       
          <div className="absolute bottom-0 right-0 bg-[url('/img/footr-bg-shade1.png')] h-[424px] w-[526px] z-2 "></div>
      
      <div className="container-custom grid grid-cols-1 gap-10 lg:gap-20 md:grid-cols-4 relative z-5">

        <div className="   col-span-1 md:col-span-2 ">
          <a href="#">
            <img src="/img/footer-logo.png" alt="" className="max-w-[200px] md:max-w-[300px] lg:max-w-full" />
          </a>      


          <p className=" text-[18px] leading-relaxed tracking-widest text-white mt-[40px] md:mt-[90px] lg:!mt-[138px] font-normal ">
            Copyright Near Human © 2026
            <br />
            All Rights Reserved
          </p>
        </div>

        <div>
          <h4 className="text-[27px]  font-normal text-white   !mb-[15px] ">
            Quick Links
          </h4>
          <ul className=" text-[#F7F8F8] ">
            <li className="!mb-[20px]">
              <a
                href="#"
                className=" hover:text-primary text-[16px]  !font-normal transition-colors duration-300"
              >
                Home
              </a>
            </li>
            <li className="!mb-[20px]">
              <a
                href="#"
                className="hover:text-primary !font-normal transition-colors duration-300"
              >
                About
              </a>
            </li>
            <li className="!mb-[20px]">
              <a
                href="#"
                className="hover:text-primary !font-normal transition-colors duration-300"
              >
                Scootrr
              </a>
            </li>
            <li className="!mb-[20px]">
              <a
                href="#"
                className="hover:text-primary !font-normal transition-colors duration-300"
              >
               Our Work
              </a>
            </li>
            <li className="!mb-[20px]">
              <a
                href="#"
                className="hover:text-primary !font-normal transition-colors duration-300"
              >
                Blogs
              </a>
            </li>
            <li className="!mb-[20px]" >
              <a
                href="#"
                className="hover:text-primary !font-normal transition-colors duration-300"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className=" text-[27px] font-normal  text-white  !mb-[15px] ">
            Connect with our          
            experts today
          </h4>
          <ul className=" text-[#F7F8F8] ">
            <li className="!mb-[20px]">
              <a
                href="#"
                className="hover:text-primary text-[16px]  !font-normal transition-colors duration-300 flex gap-2 items-center " >
                <span className="text-[8px]">
                  <div className="w-[20px]"> 
                  <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.012 0H13.1484L8.45752 5.3411L13.938 12.5864H9.63721L6.26999 8.1835L2.41511 12.5864H0.278666L5.24821 6.87377L0 0H4.40757L7.44968 4.02208L11.012 0ZM10.2642 11.3324H11.4485L3.78522 1.20755H2.51264L10.2642 11.3324Z" fill="#F7F8F8"/>
                    </svg>                  
                    </div>
                  </span> 
                      Twitter
              </a>
            </li>
            <li className="!mb-[20px]">
              <a
                href="#"
                className="hover:text-primary text-[16px]  !font-normal transition-colors duration-300 flex gap-2 items-center">
                <span className="text-[8px]">
                  <div className="w-[20px]"> 
                  <svg width="7" height="15" viewBox="0 0 7 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.57486 15.0004H4.59378V7.4348H6.70231L6.92729 4.90247H4.59378C4.59378 4.90247 4.59378 3.95545 4.59378 3.45841C4.59378 2.86195 4.71411 2.6265 5.28964 2.6265C5.7553 2.6265 6.92206 2.6265 6.92206 2.6265V0C6.92206 0 5.2007 0 4.82922 0C2.57942 0 1.56963 0.988855 1.56963 2.88287C1.56963 4.53098 1.56963 4.90247 1.56963 4.90247H0V7.46619H1.56963V15.0004H1.57486Z" fill="#F7F8F8"/>
                  </svg>
                  </div>
                  </span>
                   Facebook
              </a>
            </li>
            <li className="!mb-[20px]">
              <a
                href="#"
                className="hover:text-primary text-[16px]  !font-normal transition-colors duration-300 flex gap-2 items-center"
              >
                <span className="text-[8px]">
                  <div className="w-[20px]"> 
                   <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M2.78894 4.11035H0.244141V12.3252H2.78894V4.11035Z" fill="#F7F8F8"/>
                          <path d="M1.50304 3.03716C2.3323 3.03716 3.00607 2.35821 3.00607 1.51858C3.00607 0.678954 2.3323 0 1.50304 0C0.673779 0 0 0.678954 0 1.51858C0 2.35821 0.668596 3.03716 1.50304 3.03716Z" fill="#F7F8F8"/>
                          <path d="M6.85159 8.01799C6.85159 6.86221 7.38543 6.17289 8.40128 6.17289C9.3342 6.17289 9.78511 6.83111 9.78511 8.01799C9.78511 9.19969 9.78511 12.3302 9.78511 12.3302H12.3144C12.3144 12.3302 12.3144 9.32926 12.3144 7.12654C12.3144 4.92381 11.0653 3.86133 9.32383 3.86133C7.58238 3.86133 6.84641 5.21924 6.84641 5.21924V4.1101H4.40527V12.325H6.84641C6.8516 12.3301 6.85159 9.28262 6.85159 8.01799Z" fill="#F7F8F8"/>
                         </svg>
                         </div>
                  </span> 
                LinkedIn
              </a>
            </li>
            <li className="!mb-[20px]">
              <a
                href="#"
                className="hover:text-primary text-[16px]  !font-normal transition-colors duration-300 flex gap-2 items-center"
              >
                <span className="text-[8px]">
                  <div className="w-[20px]"> 
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M7.49707 1.34947C9.49821 1.34947 9.73466 1.35525 10.5247 1.39562C11.2571 1.43022 11.6551 1.55131 11.9146 1.65512C12.2664 1.79353 12.5143 1.955 12.7739 2.21452C13.0391 2.4798 13.2006 2.72777 13.3332 3.07379C13.4371 3.33907 13.5582 3.737 13.5928 4.46363C13.6274 5.25371 13.6389 5.49016 13.6389 7.4913C13.6389 9.49244 13.6331 9.72888 13.5928 10.519C13.5582 11.2514 13.4371 11.6493 13.3332 11.9088C13.1948 12.2606 13.0334 12.5086 12.7739 12.7739C12.5143 13.0334 12.2606 13.2006 11.9146 13.3332C11.6493 13.4371 11.2514 13.5582 10.5247 13.5928C9.73466 13.6274 9.49821 13.6389 7.49707 13.6389C5.49593 13.6389 5.25948 13.6331 4.46941 13.5928C3.737 13.5582 3.33908 13.4371 3.07956 13.3332C2.72778 13.1948 2.4798 13.0334 2.21452 12.7739C1.955 12.5086 1.78776 12.2606 1.65512 11.9088C1.55131 11.6435 1.43021 11.2456 1.39561 10.519C1.36101 9.72888 1.34947 9.49244 1.34947 7.4913C1.34947 5.49016 1.35524 5.25371 1.39561 4.46363C1.43021 3.73123 1.55131 3.3333 1.65512 3.07379C1.79353 2.72201 1.955 2.47403 2.21452 2.21452C2.4798 1.94924 2.72778 1.78776 3.07956 1.65512C3.34484 1.55131 3.74277 1.43022 4.46941 1.39562C5.25948 1.36101 5.49593 1.34947 7.49707 1.34947ZM7.49707 0C5.46133 0 5.20758 0.0115262 4.40597 0.0461281C3.61013 0.0807299 3.06226 0.207607 2.5836 0.39215C2.08764 0.58246 1.67242 0.841974 1.2572 1.2572C0.841979 1.67242 0.582465 2.09342 0.392155 2.58361C0.207611 3.06227 0.0807343 3.60437 0.0461325 4.40598C0.0115306 5.20759 0 5.46133 0 7.49707C0 9.53281 0.00576363 9.78655 0.0461325 10.5882C0.0807343 11.384 0.207611 11.9319 0.392155 12.4105C0.582465 12.9007 0.841979 13.3217 1.2572 13.7369C1.67242 14.1522 2.09341 14.4117 2.5836 14.602C3.06226 14.7865 3.60436 14.9134 4.40597 14.948C5.20758 14.9826 5.46133 14.9941 7.49707 14.9941C9.53281 14.9941 9.78656 14.9884 10.5882 14.948C11.384 14.9134 11.9319 14.7865 12.4105 14.602C12.9065 14.4117 13.3217 14.1522 13.7369 13.7369C14.1522 13.3217 14.4117 12.9007 14.602 12.4105C14.7865 11.9319 14.9134 11.3898 14.948 10.5882C14.9826 9.78655 14.9941 9.53281 14.9941 7.49707C14.9941 5.46133 14.9884 5.20759 14.948 4.40598C14.9134 3.61014 14.7865 3.06227 14.602 2.58361C14.4117 2.09342 14.1522 1.67242 13.7369 1.2572C13.3217 0.841974 12.9007 0.58246 12.4105 0.39215C11.9319 0.207607 11.3898 0.0807299 10.5882 0.0461281C9.78656 0.0115262 9.53281 0 7.49707 0Z" fill="#F7F8F8"/>
                       <path d="M7.49687 3.65039C5.36886 3.65039 3.64453 5.37473 3.64453 7.50274C3.64453 9.63076 5.36886 11.3551 7.49687 11.3551C9.62489 11.3551 11.3492 9.63076 11.3492 7.50274C11.3492 5.37473 9.62489 3.65039 7.49687 3.65039ZM7.49687 9.99984C6.11856 9.99984 4.99977 8.88105 4.99977 7.50274C4.99977 6.12444 6.11856 5.00563 7.49687 5.00563C8.87518 5.00563 9.99397 6.12444 9.99397 7.50274C9.99397 8.88105 8.87518 9.99984 7.49687 9.99984Z" fill="#F7F8F8"/>
                       <path d="M12.3996 3.49473C12.3996 3.99088 11.9958 4.39472 11.4996 4.39472C11.0035 4.39472 10.5996 3.99088 10.5996 3.49473C10.5996 2.99857 11.0035 2.59473 11.4996 2.59473C11.9958 2.59473 12.3996 2.99857 12.3996 3.49473Z" fill="#F7F8F8"/>
                        </svg>
                        </div>
                  </span> 
                  Instagram
              </a>
            </li>
          </ul>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
