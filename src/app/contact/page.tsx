import React from 'react'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import ContactBanner from '@/components/sections/contact-us/ContactBanner'
import WhatsNear from '@/components/sections/blogs/WhatsNear'
import ContactForm from '@/components/sections/contact-us/ContactForm'

function page() {
  return (
    <div>
      <Navbar/>
       <ContactBanner/>
       <ContactForm/>
       <WhatsNear/>
      <Footer/>
    </div>
  )
}

export default page