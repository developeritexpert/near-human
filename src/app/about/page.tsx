import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import Advisor from '@/components/sections/about/Advisor'
import OurJourney from '@/components/sections/about/OurJourney'
import OurMission from '@/components/sections/about/OurMission'
import Team from '@/components/sections/about/Team'
import React from 'react'

function page() {
  return (
    <div>
        <Navbar/>
        <OurMission/>
        <OurJourney/>
        <Team/>
        <Advisor/>
        <Footer/>
    </div>
  )
}

export default page