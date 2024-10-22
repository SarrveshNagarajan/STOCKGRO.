import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Secondpage from '../pages/Secondpage'
import BottomContact from './BottomContact'

const Home = () => {
  return (

    
    <div>
        <Navbar />
        <Hero />
        <Secondpage />
        <BottomContact />
    </div>
  )
}

export default Home