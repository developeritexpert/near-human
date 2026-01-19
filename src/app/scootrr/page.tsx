import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import EcoSystem from '@/components/sections/home/EcoSystem'
import OurPartners from '@/components/sections/home/OurPartners'
import DropMessage from '@/components/sections/scootrr/DropMessage'
import ImageSec from '@/components/sections/scootrr/ImageSec'
import ScootrrSec from '@/components/sections/scootrr/ScootrrSec'
import SideVideo from '@/components/sections/scootrr/SideVideo'
import TinyComputerVision from '@/components/sections/scootrr/TinyComputerVision'
import VehicleTechStack from '@/components/sections/scootrr/VehicleTechStack'

import React from 'react'

function page() {
  return (
    <div>
     <Navbar/> 
     <ScootrrSec/>
     <ImageSec/>
     <SideVideo/>
     <TinyComputerVision/>
     <VehicleTechStack/>
     <OurPartners/>
     <DropMessage/>
     <Footer/>
    </div>
  )
}

export default page