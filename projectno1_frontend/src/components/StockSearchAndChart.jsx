import React, { useState } from 'react';
import axios from 'axios';
import StockChart from './StockChart'; // Adjust the path as necessary
import AccuracyPieChart from './AccuracyPieChart';
import LoadingSpinner from './LoadingSpinner'; // Import the LoadingSpinner component

const StockSearchAndChart = () => {
  const [stockSymbol, setStockSymbol] = useState('');
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false); // New state for prediction loading
  const [error, setError] = useState('');
  const [showPredictButton, setShowPredictButton] = useState(false);
  const [showDaysInput, setShowDaysInput] = useState(false);
  const [days, setDays] = useState(7); // Default to 7 days
  const [predictions, setPredictions] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setHistoricalData([]);
    setPredictions(null);
    setShowPredictButton(false);
    setShowDaysInput(false);

    try {
      const response = await axios.get('https://indian-stock-exchange-api2.p.rapidapi.com/historical_data', {
        params: { stock_name: stockSymbol, period: '5yr', filter: 'price' },
        headers: {
          'x-rapidapi-key': import.meta.env.VITE_API_KEY,
          'x-rapidapi-host': 'indian-stock-exchange-api2.p.rapidapi.com'
        }
      });
      
      if (response.data && response.data.datasets && response.data.datasets.length > 0) {
        const priceData = response.data.datasets.find(dataset => dataset.metric === "Price");
        if (priceData && priceData.values) {
          const formattedData = priceData.values.map(([date, price]) => ({
            date: date,
            price: parseFloat(price)
          }));
          setHistoricalData(formattedData);
          setShowPredictButton(true);
        } else {
          setError('No price data found for the given stock symbol.');
        }
      } else {
        setError('No data found for the given stock symbol.');
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
      setError('Failed to fetch data. Please check the stock symbol and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredictClick = () => {
    setShowDaysInput(true);
  };

  const handlePredict = async () => {
    setIsPredicting(true); // Start showing the LoadingSpinner
    setError('');
    setPredictions(null);

    try {
      const response = await axios.post('http://localhost:8000/predict', {
        ticker: stockSymbol,
        days: days
      }, {
        withCredentials: false
      });

      setPredictions(response.data);
    } catch (error) {
      console.error('Error predicting stock prices:', error);
      setError('Failed to predict stock prices. Please try again.');
    } finally {
      setIsPredicting(false); // Stop showing the LoadingSpinner
    }
  };

  return (
    <div className="mb-8">
      {(isLoading || isPredicting) && <LoadingSpinner />} {/* Show LoadingSpinner when loading or predicting */}
      <form onSubmit={handleSearch} className="mb-4 w-full items-center">
        <input
          type="text"
          value={stockSymbol}
          onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
          placeholder="Enter stock symbol (e.g., RELIANCE)"
          className="p-2 border-[4px] rounded w-full mr-2"
          required
        />
        <button 
          type="submit" 
          className="bg-black hover:bg-gray-700 ease-in-out duration-300 mx-[550px] my-3 w-[120px] justify-center items-center text-white p-2 rounded" 
          disabled={isLoading || isPredicting}
        >
          {isLoading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {historicalData.length > 0 && (
        <div>
          <StockChart stockSymbol={stockSymbol} initialData={historicalData} />

          {showPredictButton && (
            <button 
              onClick={handlePredictClick} 
              className="bg-black hover:bg-gray-700 ease-in-out duration-300 mx-[550px] my-3 w-[120px] justify-center items-center text-white p-2 rounded"
              disabled={isPredicting}
            >
              Predict
            </button>
          )}

          {showDaysInput && (
            <div className="mb-4">
              <label htmlFor="days" className="mr-2">No. of days:</label>
              <input
                type="number"
                id="days"
                // value={days}
                onChange={(e) => setDays(e.target.value)}
                min={0}
                max={10}
                className="p-2 border-[4px] rounded w-full mr-2"
              />
              <button 
                onClick={handlePredict} 
                className="bg-black hover:bg-gray-700 ease-in-out duration-300 mx-[550px] my-3 w-[120px] justify-center items-center text-white p-2 rounded"
                disabled={isPredicting}
              >
                {isPredicting ? 'Predicting...' : 'Predict'}
              </button>
            </div>
          )}
        </div>
      )}

      {predictions && (
        <div className="mt-8">
          <h3 className="font-bold mb-4 text-xl">Prediction Results for {stockSymbol}</h3>
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 pr-4">
              <h4 className="font-semibold mb-2">Predicted Prices</h4>
              <ul className="bg-gray-100 p-4 rounded">
                {predictions.predictions.map((prediction, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-medium">{prediction.date}:</span> ₹{prediction.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full md:w-1/2 mt-4 md:mt-0">
              <h4 className="font-semibold mb-2">Prediction Accuracy</h4>
              <AccuracyPieChart accuracy={predictions.accuracy * 100} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockSearchAndChart;