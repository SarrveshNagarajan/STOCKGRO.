import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrendingStocks = ({onLoadComplete}) => {
  const [trendingStocks, setTrendingStocks] = useState({ topGainers: [], topLosers: [] });

  useEffect(() => {
    const fetchTrendingStocks = async () => {
      try {
        const response = await axios.get('https://indian-stock-exchange-api2.p.rapidapi.com/trending', {
          headers: {
            'x-rapidapi-key': import.meta.env.VITE_API_KEY,
            'x-rapidapi-host': 'indian-stock-exchange-api2.p.rapidapi.com'
          }
        });

        const { trending_stocks } = response.data;

        setTrendingStocks({
          topGainers: trending_stocks.top_gainers || [],
          topLosers: trending_stocks.top_losers || []
        });
      } catch (error) {
        console.error('Error fetching trending stocks:', error);
      } finally {
        onLoadComplete();
      }
    };

    fetchTrendingStocks();
  }, [onLoadComplete]);

  return (
    <div className="p-6 my-4 ">
      <h3 className="text-2xl font-bold mb-4">Trending Stocks</h3>

      {/* Top Gainers Section */}
      <div className="mb-6">
        <h4 className="text-xl font-semibold mb-4">Top Gainers</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {trendingStocks.topGainers.map((stock) => (
            <div key={stock.ticker_id} className="bg-black p-4 rounded-lg shadow-md">
              <p className="font-bold text-lg text-white">{stock.company_name}</p>
              <p className="text-white">Price: <span className='text-green-600'>₹{stock.price}</span></p>
              <p className="text-green-600">+{stock.percent_change}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Losers Section */}
      <div>
        <h4 className="text-xl font-semibold mb-4">Top Losers</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {trendingStocks.topLosers.map((stock) => (
            <div key={stock.ticker_id} className="bg-black p-4 rounded-lg shadow-md">
              <p className="font-bold text-lg text-white">{stock.company_name}</p>
              <p className="text-white">Price: <span className='text-red-600'>₹{stock.price}</span></p>
              <p className="text-red-600">{stock.percent_change}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingStocks;
