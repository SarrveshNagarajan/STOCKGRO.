import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";
import axios from 'axios';


const SignupPage = () => {
  const[data, setData] = useState({
    email : '',
    password : '',
    confirmpassword : '',
  })

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    try {
        const response = await axios.post('/signup', {
            email: data.email,
            password: data.password,
            confirmpassword : data.confirmpassword,
        });

        if (data.password !== data.confirmpassword) {
          alert("Passwords do not match");
          return;
        }
  

        if (response.data.message === "User created successfully") {
            alert("Signup successful! Please login to continue.");
            navig('/login');
        } else if(response.data.message === "User already exists"){
            alert("User already exists. Please login to continue");
            navig('/login');
        }else {
            alert("Signup failed! Please try again.");
        }

    } catch (error) {
        console.error("Error during signup:", error);
        alert("There was an issue with the signup process. Please try again later.");
    }
  };


  const navig = useNavigate();

  const redirect = () => {
    navig('/login');
  }

  return (
    <div className='text-white mt-[140px] justify-center flex flex-col mt-[130px] items-center'>
      <h1 className='text-5xl ml-[-30px] font-bold tracking-tight justify-center'>
        Signup
      </h1>

      <form className='flex flex-col mt-10' onSubmit={handleSubmit}>
        <input
          className='text-black mb-6 p-3 w-[400px] rounded-md'
          type='email'
          placeholder='Email'
          value={data.email}
          onChange={(e) => setData({...data, email : e.target.value})}
        />
        <input
          className='text-black mb-6 p-3 w-[400px] rounded-md'
          type='password'
          placeholder='Password'
          value={data.password}
          onChange={(e) => setData({...data, password : e.target.value})}
        />
        <input
            className='text-black mb-4 p-3 w-[400px] rounded-md'
            type='password'
            placeholder='Confirm Password'
            value={data.confirmpassword}
            onChange={(e) => setData({...data, confirmpassword : e.target.value})}
          />
        <button
          type='submit'
          className='bg-[#00df9a] mt-8 hover:bg-green-500 ml-[92px] transition duration-300 ease-in-out w-[200px] py-4 rounded-md font-medium text-[#000000]'
        >
          Signup
        </button>

        <p className='mt-6 ml-[77px]'>
           Already have an account?
          <span
            className='text-[#00df9a] hover:text-[#22c55e] cursor-pointer ml-1'
            onClick={redirect}
          >
            Login
          </span>
        </p>

        <div className='relative mt-10 ml-[170px]'></div>

      </form>
    </div>
  );
};

export default SignupPage;
