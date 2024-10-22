import React, {Component} from 'react'
import {Render} from 'react-dom'
import {ReactTyped} from 'react-typed'
import { FaArrowRight } from "react-icons/fa";
import Bgvideo from "../assets/gif_2.webm";
import { useNavigate } from 'react-router-dom';


const Hero = () => {

  const navigate = useNavigate();
  const handlelogin = () => {
    navigate("/auth");
  }
  return (
    <div className='relative w-full h-screen'>
      {/* Background Video */}
      <video
        className='absolute top-0 left-0 w-full h-full object-cover z-[-10]'
        src={Bgvideo}
        autoPlay
        loop
        muted
      ></video>

      {/* Overlay (optional, for better readability) */}
      <div className='absolute top-0 left-0 w-full h-full bg-black opacity-50'></div>

      {/* Content */}
      <div className='relative z-10 text-white'>
        <div className='max-w-[1000px] mt-[-110px] w-full h-screen mx-auto text-center flex flex-col justify-center'>
          <p className='text-xl text-[#00df9a] font-bold p-1'>WEALTHIER WITH STOCK PREDICTIONS</p>
          <h1 className='md:text-6xl sm:text-4xl text-2xl font-extrabold tracking-tight py-4'>
            Make Informed Investments.
          </h1>
          <div className='pt-3'>
            <p className='text-[#F6F5F2] md:text-3xl sm:text-2xl text-xl font-semibold'>
              Invest Your Money{' '}
              <ReactTyped
                className='md:text-3xl sm:text-2xl text-xl font-semibold'
                strings={['Smarter!', 'Better!', 'Wiser!']}
                typeSpeed={120}
                backSpeed={140}
                loop
              />
            </p>
          </div>
          <p className='md:text-xl text-xl pt-3 font-medium text-gray-400'>
            Know the possible future prices of your favorite stock with AI.
          </p>
          <button onClick={handlelogin} className='bg-[#00df9a] hover:bg-green-500 transition duration-300 ease-in-out my-8 w-[220px] py-3 mx-auto flex items-center justify-center rounded-md font-medium mt-8 text-[#000000]'>
            Get Started <FaArrowRight className='ml-2 my-2' size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;