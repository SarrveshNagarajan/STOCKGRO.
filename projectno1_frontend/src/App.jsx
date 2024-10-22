import React from 'react'
import Login_prompt from './components/Login_prompt'
import { BrowserRouter, Routes, Route  } from 'react-router-dom'
// import { router } from './Routes'
import Home from './pages/Home_page'

import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import axios from 'axios'
import MainPage from './pages/MainPage'

axios.defaults.baseURL = 'https://stockgro-backend.onrender.com/api';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';



function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='auth' element={<LoginPage />}></Route>
          <Route path='signup' element={<SignupPage />}></Route>
          <Route path='login' element={<LoginPage />}></Route>
          <Route path='mainpage' element={<MainPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
