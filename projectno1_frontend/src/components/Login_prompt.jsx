import React, { useState } from 'react';
import { FaGoogle } from "react-icons/fa";



const LoginPrompt = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and sign-up forms
  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className='text-white mt-[140px] justify-center flex flex-col mt-[130px] items-center'>
      
      <h1
        className={`text-5xl ml-[-30px] font-bold tracking-tight ${
          isLogin ? 'justify-center' : 'justify-center'
        }`}
      >
        {isLogin ? 'Login' : 'Sign Up'}
      </h1>

      <form className='flex flex-col mt-10'>
        <input
          className='text-black mb-6 p-3 w-[400px] rounded-md'
          type='email'
          placeholder='Email'
        />
        <input
          className='text-black mb-6 p-3 w-[400px] rounded-md'
          type='password'
          placeholder='Password'
        />
        {!isLogin && (
          <input
            className='text-black mb-4 p-3 w-[400px] rounded-md'
            type='password'
            placeholder='Confirm Password'
          />
        )}

        <button className='bg-[#00df9a] mt-8 hover:bg-green-500 ml-[92px] transition duration-300 ease-in-out w-[200px] py-4 rounded-md font-medium text-[#000000]'>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>

        <p className='mt-6 ml-[77px]'>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <span
            className='text-[#00df9a] hover:text-[#22c55e] cursor-pointer ml-1'
            onClick={toggleForm}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
        <div className='relative mt-10 ml-[170px]'>
          <div className='hover:bg-green-500 ease-in-out transition duration-300 cursor-pointer w-[50px] h-[50px] flex items-center justify-center rounded-full bg-[#00df9a]'>
            <FaGoogle className='text-black ' size={24} /> {/* Adjust size as needed */}
            <span className='absolute left-[-50%] -bottom-8 bg-gray-700 text-white text-xs rounded-md p-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
            Sign in using Google
            </span>
          </div>
          
        </div>

      </form>

      
    </div>


  );
};

export default LoginPrompt;
