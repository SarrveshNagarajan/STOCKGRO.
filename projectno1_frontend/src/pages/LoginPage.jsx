import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";
import axios from 'axios'
import MainPage from './MainPage';
import SignupPage from './SignupPage';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navig = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/login', {
        email, 
        password,
      }, {
        withCredentials: true
      });
  
      if (response.data.message === "Login successful") {
        localStorage.setItem('token',response.data.token);
        navig('/mainpage');
      } else {
        alert("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error during login:", error);
      
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        if (error.response.status === 400 && error.response.data.message === 'User not found') {
          alert("You are not a registered user. Kindly signup to proceed");
          navig('/signup');
        } else {
          alert(error.response.data.message || "An error occurred during login");
        }
      } else if (error.request) {
        // The request was made but no response was received
        alert("No response received from the server. Please try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        alert("An error occurred during login. Please try again later.");
      }
    }
  };
  
  const redirect = () => {
    navig('/signup');
  }

  return (
    <div className='text-white mt-[140px] justify-center flex flex-col mt-[130px] items-center'>
      <h1 className='text-5xl ml-[-30px] font-bold tracking-tight justify-center'>
        Login
      </h1>

      <form className='flex flex-col mt-10' onSubmit={handleSubmit}>
        <input
          className='text-black mb-6 p-3 w-[400px] rounded-md'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className='text-black mb-6 p-3 w-[400px] rounded-md'
          type='password'
          placeholder='Password'
          value={password}
          minLength={8}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type='submit'
          className='bg-[#00df9a] mt-8 hover:bg-green-500 ml-[92px] transition duration-300 ease-in-out w-[200px] py-4 rounded-md font-medium text-[#000000]'
        >
          Login
        </button>

        <p className='mt-6 ml-[77px]'>
           Don't have an account?
          <span
            className='text-[#00df9a] hover:text-[#22c55e] cursor-pointer ml-1'
            onClick={redirect}
          >
            Sign Up
          </span>
        </p>

        <div className='relative mt-10 ml-[170px]'></div>

      </form>
    </div>
  );
};

export default LoginPage;
