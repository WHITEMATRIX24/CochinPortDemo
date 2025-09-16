import { serverUrl } from '@/services/serverUrl';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/* const data = [
  { commodity: 'NAVY VESSE', value: 120 },
  { commodity: 'METHANOL', value: 200 },
  { commodity: 'Containers', value: 450 },
  { commodity: 'CEMENT', value: 80 },
  { commodity: 'LPG', value: 150 },
  { commodity: 'SPM', value: 250 },
  { commodity: 'PASSENGER', value: 150 },
  { commodity: 'DIESEL', value: 150 },
  { commodity: 'BARGE', value: 150 },
  { commodity: 'METAL', value: 450 },
];
 */
interface Props {
  startDate:string;
  endDate:string;
}
export default function CommodityCargoBarChart({startDate, endDate}:Props) {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(`${serverUrl}/api/cargo/commodity-volumes?startDate=${startDate}&endDate=${endDate}`)
      .then((res) => res.json())
      .then((resData) => {
        console.log(resData);
        
        setData(resData)})
  }, []);

  return (
    <div className="w-full h-100 p-4 bg-white shadow rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Commodity Code-wise Cargo Handled</h2>
      {!data.length?<p className='text-black text-center mt-20'>No Data from {startDate} to {endDate}</p>
      :<ResponsiveContainer width="100%" height="90%" style={{border:'none'}}>
        <BarChart data={data} margin={{ bottom: 20, left:10 }} >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="cargoType" 
            interval={0} 
            angle={-30} 
            textAnchor="end" 
            height={0} 
            /* height={40}  */

          />
          <YAxis
  tickFormatter={(value) => {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
    if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
    return value;
  }}
/>
          <Tooltip />
          <Bar dataKey="totalVolume" fill="#3B82F6" name="Cargo (MT/TEUs)" />
          
        </BarChart>
      </ResponsiveContainer>}
    </div>
  );
}
