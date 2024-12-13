import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Legend } from "chart.js";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const BarChartV2 = ({ chartConfig, chartData, dataKey, labelKey, nameKey }) => {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <XAxis
          dataKey={labelKey}
          tickLine={false}
          tickMargin={8}
          axisLine={false}
          //   tickFormatter={(value) => value.slice(0, 3)}
        />
        <CartesianGrid vertical={false} />
        <Bar dataKey={dataKey} fill="var(--color-date)" radius={6} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
      </BarChart>
    </ChartContainer>
  );
};

export default BarChartV2;
