import React from "react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const PieChartV2 = ({ chartConfig, chartData }) => {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={180}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={Object.values(chartConfig)[index].color}
              />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PieChartV2;
