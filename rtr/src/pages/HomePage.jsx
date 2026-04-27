import React from 'react'
import Navbar from '../components/layout/Navbar/Navbar'
import Herosection from '../components/layout/Herosection/Herosection'
import Footer from '../components/layout/Footer/Footer'

import logo from "../../src/assets/flow.png";
import FlowSection from '../components/sections/Flowsection/FlowSection';

export default function HomePage() {
  
  return (
    

    <div>
     
      <Herosection />
      <FlowSection/>
      
    </div>
  )
}