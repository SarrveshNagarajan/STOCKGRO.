import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const AccuracyPieChart = ({ accuracy }) => {
  const roundedAccuracy = Math.round(accuracy * 100) / 100;
  const data = [
    { name: 'Accuracy', value: roundedAccuracy },
    { name: 'Margin of Error', value: 100 - roundedAccuracy },
  ];

  const COLORS = ['#16a34a', '#f3f4f6'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length && payload[0].name === 'Accuracy') {
      return (
        <div className="bg-white border border-gray-200 p-2 shadow-md rounded">
          <p className="font-semibold">{`${payload[0].value.toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {/* <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => (value === 'Accuracy' ? 'Accuracy' : '')}
          /> */}
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-3xl font-bold text-gray-800">{`${roundedAccuracy}%`}</p>
        <p className="text-md font-medium text-gray-800">Accuracy</p>
      </div>
    </div>
  );
};

export default AccuracyPieChart;