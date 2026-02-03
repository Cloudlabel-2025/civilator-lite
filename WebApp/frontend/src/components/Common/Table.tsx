import React from "react";
import { MoreVertical } from "lucide-react";

interface Column {
  key: string;
  header: string;
  maxWidth?: string;
  render?: (value: any, row: any) => React.ReactNode;
  mobileLabel?: string; // Label to show in mobile card view
  showInMobile?: boolean; // Whether to show this field in mobile view
  mobileValueOnly?: boolean; // Whether to show this field in mobile view
}

interface TableProps {
  columns: Column[];
  data: any[];
  actions?: (row: any) => React.ReactNode;
  mobileCardTitle?: (row: any) => string | React.ReactNode; // Function to generate card title
  mobileCardSubtitle?: (row: any) => string; // Function to generate card subtitle
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  actions,
  mobileCardTitle,
  mobileCardSubtitle,
}) => {
  const mobileColumns = columns.filter((col) => col.showInMobile !== false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-400 md:border-gray-200 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={` ${
                    column.maxWidth
                      ? `w-[${column.maxWidth}]`
                      : "w-[max-content]"
                  } px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                >
                  {column.header}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`${
                      column.maxWidth
                        ? `w-[${column.maxWidth}]`
                        : "w-[max-content]"
                    } px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize`}
                  >
                    {column.key == "sno"
                      ? rowIndex + 1
                      : column.render
                      ? column.render(row[column.key], row) || "-"
                      : row[column.key] || "-"}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {actions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="p-4 border-b border-gray-400 last:border-b-0"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                {mobileCardTitle && (
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {mobileCardTitle(row)}
                  </h3>
                )}
                {mobileCardSubtitle && (
                  <p className="text-xs text-gray-600 mb-2">
                    {mobileCardSubtitle(row)}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex items-center space-x-1 ml-2">
                  {actions(row)}
                </div>
              )}
            </div>

            <div className="space-y-2">
              {mobileColumns.map((column) => {
                const value = row[column.key];

                return (
                  <div
                    key={column.key}
                    className="flex justify-between items-center"
                  >
                    {column.mobileValueOnly ? (
                      column.render ? (
                        column.render(value, row) || ""
                      ) : (
                        value || ""
                      )
                    ) : (
                      <>
                        <span className="text-xs font-medium text-gray-500">
                          {column.mobileLabel}:
                        </span>
                        <span className="w-max text-xs text-gray-900 text-right flex justify-end flex-1 ml-2">
                          {column.render
                            ? column.render(value, row) || ""
                            : value || ""}
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="p-6 text-center">
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </div>
  );
};
