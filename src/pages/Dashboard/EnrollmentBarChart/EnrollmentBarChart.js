import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const EnrollmentBarChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://e-learning-server-hazel.vercel.app/enroll-stats')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching chart data:', error));
  }, []);

  console.log('Chart Data:', data);

  return (
    <div className="w-full h-[400px] p-4 ">
      <h2 className="text-2xl font-semibold mb-4 text-center">📊 Student Enrollment Stats</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="course" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="students" fill="#6366f1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnrollmentBarChart;
