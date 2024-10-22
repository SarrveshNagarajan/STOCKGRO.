import React from 'react'
import Pic from '../assets/stk.jpg'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'


const Secondpage = () => {

  const navigate = useNavigate();
  const handlelogin = () =>{
    navigate("/auth");
  }

  return (
    
    <div className='w-full bg-white py-16 rounded-t-3xl px-4'>
        <div className='max-w-[1240px] mx-auto'>
            <img className='w-[500px] mx-auto my-4' src={Pic} alt='/' ></img>
            <div className='flex flex-col justify-center'>
                <p className='text-[#00df9a] font-bold'>GET IMMEDIATE PREDICTIONS WITH STOCKGRO.</p>
                <h1 className='text-black md:text-4xl sm:text-3xl font-bold outline-black py-2 text-2xl'>Your AI Investment Forecaster</h1>
                <p className='font-medium'>Unlock the future of your investments with STOCKGRO, an AI-powered platform that gives you precise stock predictions at your fingertips.
                Whether you're a seasoned trader or just starting out, our intelligent forecasts help you make smarter, data-driven decisions. 
                Explore the potential of AI to guide your financial growth today!</p>
                <button onClick={handlelogin} className='bg-black hover:bg-gray-700 transition duration-300 ease-in-out my-8 w-[220px] py-3 mx-auto flex items-center justify-center rounded-md font-medium mt-8 text-white'>Try now</button>
            </div>
            
        </div>
    </div>
  )
}

export default Secondpage