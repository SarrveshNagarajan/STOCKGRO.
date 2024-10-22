import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import Login_prompt from './Login_prompt';
import { useNavigate } from 'react-router-dom';



const Navbar = () => {
    const [nav, setNav] = useState(false);
    const navigate = useNavigate();

    const handlelogin = () =>{
        navigate("/login")
    }
    const handleNav = () => {
        setNav(!nav);
    };

    const handleClick = (e) => {
        e.preventDefault();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    return (
        <div className='relative fixed flex z-50 justify-between items-center h-24 max-w-[1240px] mx-auto text-white'>
            <h1 className='w-full text-3xl font-bold text-[#00df9a]'>STOCKGRO.</h1>
            <ul className='hidden md:flex font-semibold'>
                <li className='p-4 mx-2 hover:text-[#00df9a]' onClick={handleClick}><a href='#contact'>Contact</a></li>
                <button onClick={handlelogin} className='bg-white hover:bg-gray-300 rounded-md ml-1 my-2 font-medium  transition duration-300 ease-in-out text-black w-[120px]' >Login/Signup</button>
            </ul>

            <div onClick={handleNav} className='block md:hidden'>
                {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
            </div>
            <div className={nav ? 'fixed left-0 top-0 w-[60%] h-full border-r border-gray-700 bg-black ease-in-out duration-500' : 'fixed left-[-100%]'}>
                <h1 className='pt-7 pl-4 w-full text-3xl font-bold text-[#00df9a]'>STOCKGRO.</h1>
                <ul className='pt-7 uppercase p-4'>
                    <li className='p-4 hover:text-[#00df9a] border-b border-gray-600'>Home</li>
                    <li className='p-4 hover:text-[#00df9a] border-b border-gray-600'>Contact</li>
                    <li className='p-4 hover:text-[#00df9a]'>Account</li>
                </ul>
            </div>

            

        </div>
    );
};

export default Navbar;
