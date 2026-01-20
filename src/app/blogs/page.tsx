import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import BannerResouraces from '@/components/sections/blogs/BannerResouraces'
import BlogGridSec from '@/components/sections/blogs/BlogGridSec'
import LatestNewsSlider from '@/components/sections/blogs/LatestNewsSlider'
import WhatsNear from '@/components/sections/blogs/WhatsNear'
import WhyReliability from '@/components/sections/blogs/WhyReliability'
import YourInsights from '@/components/sections/blogs/YourInsights'
import React from 'react'

function page() {
  return (
    <div>
        <Navbar/>
        <BannerResouraces/>
        <LatestNewsSlider/>
        <WhyReliability/>
        <BlogGridSec/>
        <YourInsights/>
        <WhatsNear/>
        <Footer/>
    </div>
  )
}

export default page