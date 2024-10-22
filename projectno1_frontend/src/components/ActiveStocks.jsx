import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const ActiveStocks = ({onLoadComplete}) => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const [nseResponse, bseResponse] = await Promise.all([
          axios.get('https://indian-stock-exchange-api2.p.rapidapi.com/NSE_most_active', {
            headers: {
              'x-rapidapi-key': import.meta.env.VITE_API_KEY,
              'x-rapidapi-host': 'indian-stock-exchange-api2.p.rapidapi.com'
            }
          }),
          axios.get('https://indian-stock-exchange-api2.p.rapidapi.com/BSE_most_active', {
            headers: {
              'x-rapidapi-key': import.meta.env.VITE_API_KEY,
              'x-rapidapi-host': 'indian-stock-exchange-api2.p.rapidapi.com'
            }
          })
        ]);

        const nseStocks = nseResponse.data.map(stock => ({ ...stock, exchange: 'NSE' }));
        const bseStocks = bseResponse.data.map(stock => ({ ...stock, exchange: 'BSE' }));
        setStocks([...nseStocks, ...bseStocks]);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      } finally {
        onLoadComplete();
      }
    };

    fetchStocks();
  }, [onLoadComplete]);

  return (
    <div className="bg-black text-white py-2 my-2 overflow-hidden">
      <div className="flex animate-ticker">
        {stocks.map((stock, index) => (
          <div key={`${stock.exchange}-${stock.ticker}-${index}`} className="flex items-center space-x-2 mx-4 whitespace-nowrap">
            <span className="text-xs text-gray-400">{stock.exchange}</span>
            <span className="font-medium">{stock.ticker}</span>
            <span className="font-semibold">{stock.price.toFixed(2)}</span>
            <span 
              className={`flex items-center ${
                stock.percent_change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {stock.percent_change >= 0 ? (
                <ArrowUpRight size={16} />
              ) : (
                <ArrowDownRight size={16} />
              )}
              <span className="ml-1">
                {Math.abs(stock.percent_change).toFixed(2)}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveStocks;