"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { useReducedMotion } from "framer-motion";

type MuscleData = { muscle: string; sets: number };

export default function MuscleChart({ data }: { data: MuscleData[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4C5A66" opacity={0.2} horizontal={false} />
          <XAxis 
            type="number"
            stroke="#4C5A66" 
            tick={{ fill: "#4C5A66", fontSize: 12, fontFamily: "var(--font-ibm-mono)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            dataKey="muscle" 
            type="category"
            stroke="#4C5A66" 
            tick={{ fill: "#EDE8DE", fontSize: 12, fontFamily: "var(--font-ibm-sans)" }}
            tickFormatter={(value) => String(value).toUpperCase()}
            tickLine={false}
            axisLine={false}
            width={80}
          />
          <Tooltip 
            cursor={{ fill: "#4C5A66", opacity: 0.1 }}
            contentStyle={{ backgroundColor: "#1B1D1F", borderColor: "#4C5A66", borderRadius: "8px" }}
            itemStyle={{ color: "#C8362B", fontFamily: "var(--font-ibm-mono)" }}
            labelStyle={{ display: "none" }}
            formatter={(value) => [`${value} Sets`, ""]}
          />
          <Bar 
            dataKey="sets" 
            radius={[0, 4, 4, 0]}
            isAnimationActive={!shouldReduceMotion}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#C8362B" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}