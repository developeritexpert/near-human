import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import FutureIntelligent from '@/components/sections/blogs-detail/ FutureIntelligent '
import ArticleSlider from '@/components/sections/blogs-detail/ArticleSlider'
import WhatsNear from '@/components/sections/blogs/WhatsNear'
import React from 'react'

function page() {
  return (
    <div>
        <Navbar/>
        <FutureIntelligent/>
          <ArticleSlider/>
         <WhatsNear/>
        <Footer/>
    </div>
  )
}

export default page