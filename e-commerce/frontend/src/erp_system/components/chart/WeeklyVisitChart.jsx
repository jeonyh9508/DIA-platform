import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeeklyVisitChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#999' }}>
        데이터 없음
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => date.substring(5)} 
          tick={{ fontSize: 12 }} 
        />
        <YAxis allowDecimals={false} />
        <Tooltip 
          labelFormatter={(label) => `${label} (일)`}
          formatter={(value) => [`${value}명`, '방문자']}
        />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="#8884d8" 
          strokeWidth={3} 
          activeDot={{ r: 8 }} 
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeeklyVisitChart;