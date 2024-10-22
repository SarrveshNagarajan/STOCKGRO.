import React, { useState, useEffect, useRef } from 'react';
import { CgProfile } from 'react-icons/cg';
import { FaPencilAlt } from 'react-icons/fa'; 
import ActiveStocks from '../components/ActiveStocks';
import StockSearchAndChart from '../components/StockSearchAndChart';
import TrendingStocks from '../components/TrendingStocks';
import LoadingSpinner from '../components/LoadingSpinner';

const MainPage = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const profileRef = useRef(null); // Reference for the profile section
  const [selectedStock, setSelectedStock] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStocksLoaded, setActiveStocksLoaded] = useState(false);
  const [trendingStocksLoaded, setTrendingStocksLoaded] = useState(false);


  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  }

  useEffect(() => {
    if(activeStocksLoaded && trendingStocksLoaded){
      setIsLoading(false);
    }
  }, [activeStocksLoaded,trendingStocksLoaded]);
 
  return (
    <div className='bg-white min-h-screen'>
      {/* Navbar */}
      {isLoading &&  <LoadingSpinner />}

      <nav className='bg-black rounded-b-2xl text-white px-4 py-4 flex justify-between items-center'>
        {/* Logo */}
        <div className='text-xl font-bold'>
          <h1 className='w-full text-3xl font-bold text-[#00df9a]'>STOCKGRO.</h1>
        </div>
      </nav>
      <ActiveStocks onLoadComplete={() => setActiveStocksLoaded(true)}/>
      {/* Main Content */}
      <div className='container mx-auto p-4'>
          
          <StockSearchAndChart />
          <TrendingStocks onLoadComplete={() => setTrendingStocksLoaded(true)} />
      </div>
    </div>
  );
};

export default MainPage;
