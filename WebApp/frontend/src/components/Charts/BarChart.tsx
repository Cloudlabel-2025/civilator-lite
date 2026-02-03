import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface BarChartProps {
  data: { name: string; value: any; color?: string }[];
  title?: string;
  color?: string;
  showLegend?: boolean;
  customSeries?: boolean;
  categories?: string[];
}

export const CustomBarChart: React.FC<BarChartProps> = ({
  data,
  title,
  color = "#588d0e",
  showLegend = false,
  customSeries = false,
  categories = [],
}) => {
  const Categories = useMemo(
    () => (categories.length ? categories : data.map((item) => item.name)),
    [data, categories]
  );
  const values = useMemo(() => data.map((item) => item.value), [data]);
  const colors = useMemo(
    () => data.map((item) => item.color || color),
    [data, color]
  );

  const options: ApexOptions = useMemo(() => {
    return {
      chart: {
        type: "bar",
        stacked: false,
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          speed: 400,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "40%",
          borderRadius: 6,
          distributed: !customSeries,
        },
      },
      colors: customSeries ? undefined : colors,
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["transparent"],
      },
      xaxis: {
        categories: Categories,
        labels: {
          trim: false,
          wrap: true,
          style: {
            fontSize: "10px",
          },
        },
      },
      legend: {
        position: "top",
        show: showLegend,
      },
    };
  }, [categories, colors]);

  const series = useMemo(
    () => [
      {
        name: "Amount",
        data: values,
      },
    ],
    [values, colors]
  );

  const _series = data.map((item) => ({
    name: item.name,
    data: Array.isArray(item.value) ? item.value : [item.value],
    color: item.color || color,
  }));

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      {title && (
        <span className="text-md font-semibold text-gray-900 mb-4 block">
          {title}
        </span>
      )}
      <Chart
        options={options}
        series={customSeries ? _series : series}
        type="bar"
        height={300}
      />
    </div>
  );
};
