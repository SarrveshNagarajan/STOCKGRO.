import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const StockChart = ({ stockSymbol, initialData = [] }) => {
  const [timeRange, setTimeRange] = useState('1M');
  const [chartType, setChartType] = useState('line');
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(getDataForTimeRange(timeRange));
  }, [timeRange, initialData]);

  const interpolateData = (startDate, endDate, startPrice, endPrice) => {
    const days = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const priceStep = (endPrice - startPrice) / days;
    const interpolatedData = [];

    for (let i = 0; i <= days; i++) {
      const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      interpolatedData.push({
        date: currentDate.toISOString().split('T')[0],
        price: Number((startPrice + i * priceStep).toFixed(2))
      });
    }

    return interpolatedData;
  };

  const generateDailyData = (startDate, endDate, initialData) => {
    const dailyData = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      const dataPoint = initialData.find(d => d.date === dateStr);
      
      if (dataPoint) {
        dailyData.push(dataPoint);
      } else {
        // Find closest previous data point
        const previousData = initialData.filter(d => new Date(d.date) <= current)
          .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        
        dailyData.push({
          date: dateStr,
          price: previousData ? previousData.price : dailyData[dailyData.length - 1]?.price
        });
      }
      
      current.setDate(current.getDate() + 1);
    }
    
    return dailyData;
  };

  const getDataForTimeRange = (range) => {
    if (!initialData || initialData.length === 0) {
      return [];
    }

    const now = new Date();
    let startDate = new Date(now);

    switch (range) {
      case '1D':
        startDate.setDate(now.getDate() - 1);
        break;
      case '1W':
        startDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '1Y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case '3Y':
        startDate.setFullYear(now.getFullYear() - 3);
        break;
      case '5Y':
        startDate.setFullYear(now.getFullYear() - 5);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    if (range === '1W') {
      return generateDailyData(startDate, now, initialData);
    }

    const filteredData = initialData.filter(item => new Date(item.date) >= startDate);
    
    if (filteredData.length < 2) {
      return filteredData;
    }

    let interpolatedData = [];
    for (let i = 0; i < filteredData.length - 1; i++) {
      const startPoint = filteredData[i];
      const endPoint = filteredData[i + 1];
      interpolatedData = interpolatedData.concat(
        interpolateData(
          new Date(startPoint.date),
          new Date(endPoint.date),
          startPoint.price,
          endPoint.price
        )
      );
    }

    return interpolatedData;
  };

  const Chart = chartType === 'line' ? LineChart : AreaChart;
  const DataSeries = chartType === 'line' ? Line : Area;

  if (data.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto border rounded p-4">
        <p className="text-center py-8">No data available for {stockSymbol}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto border rounded p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-4">{stockSymbol} Stock Price</h2>
        <div className="flex justify-between items-center">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="1D">1 Day</option>
            <option value="1W">1 Week</option>
            <option value="1M">1 Month</option>
            <option value="3M">3 Months</option>
            <option value="1Y">1 Year</option>
            <option value="3Y">3 Years</option>
            <option value="5Y">5 Years</option>
          </select>
          <div>
            <button 
              onClick={() => setChartType('line')}
              className={`px-4 py-2 rounded ${chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Line
            </button>
            <button 
              onClick={() => setChartType('area')}
              className={`px-4 py-2 rounded ml-2 ${chartType === 'area' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Area
            </button>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <Chart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis 
            domain={['dataMin', 'dataMax']}
            tickFormatter={(value) => `₹${value.toFixed(2)}`}
          />
          <Tooltip
            // labelFormatter={(value) => new Date(value).toLocaleString()}
            formatter={(value) => [`₹${value.toFixed(2)}`, 'Price']}
          />
          <Legend />
          <DataSeries 
            type="monotone" 
            dataKey="price" 
            stroke="#8884d8" 
            fill="url(#colorPrice)" 
            name="Price" 
          />
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
        </Chart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;