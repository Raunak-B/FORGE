"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useReducedMotion } from "framer-motion";

type VolumeData = { week: string; volume: number };

export default function VolumeChart({ data }: { data: VolumeData[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C99A3D" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#C99A3D" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#4C5A66" opacity={0.2} vertical={false} />
          <XAxis 
            dataKey="week" 
            stroke="#4C5A66" 
            tick={{ fill: "#4C5A66", fontSize: 12, fontFamily: "var(--font-ibm-sans)" }} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#4C5A66" 
            tick={{ fill: "#4C5A66", fontSize: 12, fontFamily: "var(--font-ibm-mono)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#1B1D1F", borderColor: "#4C5A66", borderRadius: "8px" }}
            itemStyle={{ color: "#C99A3D", fontFamily: "var(--font-ibm-mono)" }}
            labelStyle={{ color: "#EDE8DE", fontFamily: "var(--font-ibm-sans)", fontWeight: "bold", marginBottom: "4px" }}
            formatter={(value) => [`${Number(value).toLocaleString()} kg`, "Volume"]}
          />
          <Area 
            type="monotone" 
            dataKey="volume" 
            stroke="#C99A3D" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorVolume)" 
            isAnimationActive={!shouldReduceMotion}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}