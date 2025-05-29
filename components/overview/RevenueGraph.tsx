"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
} from "recharts";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface RevenueGraphProps {
  data: { month: string; revenue: number }[];
}

function RevenueGraph({ data }: RevenueGraphProps) {
  return (
    <ChartContainer config={chartConfig} className="w-full h-[350px]">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        ></XAxis>
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => `$${value.toLocaleString()}`}
        ></YAxis>
        <ChartTooltip
          content={<ChartTooltipContent />}
          formatter={(value) => `$${value.toLocaleString()}`}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="revenue"
          fill="var(--color-revenue)"
          radius={[4, 4, 0, 0]}
          activeBar={<Rectangle fill="green"></Rectangle>}
        ></Bar>
      </BarChart>
    </ChartContainer>
  );
}
export default RevenueGraph;
