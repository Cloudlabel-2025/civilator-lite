import React from "react";
import Utils from "../../helpers/utils";

interface RecordsChartProps {
  data: {
    name: string;
    desc?: string;
    value: any;
    value_label?: string;
    color?: string;
  }[];
  title?: string;
  color?: string;
}

export const RecordsChart: React.FC<RecordsChartProps> = ({
  data,
  title,
  color = "#588d0e",
}) => {
  return (
    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[340px]">
        {data.map((d: any, idx: number) => (
          <div
            key={`row-chart-row-${d.name}-${idx}`}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center`}
                style={{
                  background: Utils.getLightBgFromColor(color, 0.1),
                }}
              >
                <span className={`font-bold`} style={{ color: `${color}` }}>
                  {d.name[0]}
                </span>
              </div>
              <div>
                <h4 className={`font-medium text-gray-900 `}>{d.name}</h4>
                {d.desc && <p className="text-sm text-gray-600">{d.desc}</p>}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{d.value}</p>
              {d.value_label && (
                <p className="text-xs text-gray-600">{d.value_label}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
