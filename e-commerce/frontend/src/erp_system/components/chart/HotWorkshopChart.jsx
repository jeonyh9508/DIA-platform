import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const HotWorkshopChart = ({ data }) => {
  const navigate = useNavigate();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const handleBarClick = (entry) => {
    if (entry && entry.workshopId) {
      navigate(`/customer/workshop/${entry.workshopId}`);
    }
  };

  if (!data || data.length === 0) {
     return (
       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#999' }}>
         데이터 없음
       </div>
     );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="workshopName" 
          tick={{ fontSize: 12 }} 
          interval={0} 
          tickFormatter={(val) => val.length > 5 ? val.slice(0,5)+'..' : val}
        />
        <YAxis allowDecimals={false} />
        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
        <Bar 
          dataKey="visitWorkshopCount" 
          name="방문수" 
          barSize={40} 
          radius={[5, 5, 0, 0]} 
          onClick={handleBarClick} 
          cursor="pointer"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HotWorkshopChart;