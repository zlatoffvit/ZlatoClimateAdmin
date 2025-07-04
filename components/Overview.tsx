"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";


interface OverviewProps {
  data: {
    name: string,
    total: number
  }[];
};

const Overview: React.FC<OverviewProps> = ({
  data
}) => {
  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value} руб`}
        />
        <Bar dataKey="total" fill="#3498db" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Overview;
