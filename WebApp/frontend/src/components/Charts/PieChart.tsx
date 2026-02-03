import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface PieChartProps {
  data: { name: string; value: number; color: string }[];
  title?: string;
  showLegend?: boolean;
}

export const CustomPieChart: React.FC<PieChartProps> = ({
  data,
  title,
  showLegend = true,
}) => {
  const labels = useMemo(() => data.map((item) => item.name), [data]);
  const colors = useMemo(() => data.map((item) => item.color), [data]);
  const series = useMemo(() => data.map((item) => item.value), [data]);

  const options: ApexOptions = useMemo(
    () => ({
      labels,
      colors,
      tooltip: {
        y: {
          formatter: (value: number) => `₹${(value / 100000).toFixed(1)}L`,
        },
      },
      legend: {
        position: "bottom",
        show: showLegend,
      },
      chart: {
        type: "pie",
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(1)}%`,
      },
    }),
    [labels, colors]
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <Chart
        options={options}
        series={series.length ? series : [1]} // fallback to avoid empty pie errors
        type="pie"
        height={300}
      />
    </div>
  );
};
