import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface LineChartProps {
  data: { name: string; value: any; color?: string }[];
  title?: string;
  color?: string;
  showLegend?: boolean;
}

export const CustomLineChart: React.FC<LineChartProps> = ({
  data,
  title,
  color = "#10b981",
  showLegend = true,
}) => {
  const categories = useMemo(() => data.map((item) => item.name), [data]);
  const values = useMemo(() => data.map((item) => item.value), [data]);
  const colors = useMemo(
    () => data.map((item) => item.color || color),
    [data, color]
  );

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "line",
        toolbar: { show: false },
        animations: {
          enabled: true,
          speed: 400,
        },
      },
      xaxis: {
        categories,
        labels: {
          trim: false,
          wrap: true,
          style: {
            fontSize: "10px",
          },
        },
      },

      colors: colors,
      stroke: {
        width: 2,
      },
      markers: {
        size: 4,
      },
    }),
    [categories, colors]
  );

  const series = useMemo(
    () => [
      {
        name: "Amount",
        data: values,
      },
    ],
    [values]
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <Chart options={options} series={series} type="line" height={300} />
    </div>
  );
};
