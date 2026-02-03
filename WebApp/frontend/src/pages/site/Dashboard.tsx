import React, { useState } from "react";
import { Layout } from "../../components/Layout/Layout";
import { CustomPieChart } from "../../components/Charts/PieChart";
import { CustomBarChart } from "../../components/Charts/BarChart";
import { RecordsChart } from "../../components/Charts/RecordsChart";
import { mockSites } from "../../data/mockData";

import NoDataFound from "../../components/Common/NoDataFound";

import Utils from "../../helpers/utils";

import { PieChart, Pie, Tooltip } from "recharts";

export const Dashboard: React.FC = () => {
  const FinanceHealth = [
    {
      name: "Project Value",
      value: 150000,
      color: "#3b82f6",
    },
    {
      name: "Total Expense",
      value: 75000,
      color: "#f59e0b",
    },
    {
      name: "Total Received",
      value: 50000,
      color: "#b916f9ff",
    },
    {
      name: "Profit/Loss",
      value: 200000,
      color: "#33c87e",
    },
  ];

  const ExpensesBreakdown = [
    {
      name: "Material Expense",
      value: 30000,
      color: "#f59e0b",
    },
    {
      name: "Labor Expense",
      value: 40000,
      color: "#ef4444",
    },
    {
      name: "Site Expense",
      value: 20000,
      color: "#1091b9ff",
    },
    {
      name: "Other Expense",
      value: 20000,
      color: "#b1b1b1ff",
    },
  ];

  const FinanceSummary = [
    {
      name: "Total Amount",
      value: [10, 20, 30],
      color: "#0065ff",
    },
    {
      name: "Paid/Received Amount",
      value: [10, 20, 30],
      color: "#33c87e",
    },
    {
      name: "Pending Amount",
      value: [10, 20, 30],
      color: "#ff5b5b",
    },
  ];
  const AttendanceSummary = [
    {
      name: "Present",
      value: [10, 20, 30, 10, 20, 30, 30],
      color: "#33c87e",
    },
    {
      name: "Absent",
      value: [10, 20, 30, 10, 20, 30, 30],
      color: "#ff5b5b",
    },
    {
      name: "Half Day",
      value: [10, 20, 30, 10, 20, 30, 30],
      color: "#f59e0b",
    },
  ];
  const AttendanceSummaryLabels = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const [ProjectProgressStatusChart, setProjectProgressStatusChart] = useState([
    {
      name: "Completed",
      fill: "#0088FE",
      value: 50,
    },
    {
      name: "Total",
      fill: "#dee2e6",
      value: 100,
    },
  ]);
  const [ProjectTasksChart, setProjectTasksChart] = useState([
    {
      name: "Not Started",
      value: 10,
      fill: "#dee2e6",
      link: "task-management",
    },
    {
      name: "In Progress",
      value: 10,
      fill: "#ebb840",
      link: "task-management",
    },
    {
      name: "Completed",
      value: 20,
      fill: "#68d083",
      link: "task-management",
    },
    {
      name: "Upcoming",
      value: 40,
      fill: "#8cc7fa",
      link: "task-management",
    },
    {
      name: "Delayed",
      value: 20,
      fill: "#e6642e",
      link: "task-management",
    },
  ]);

  const [ProjectDetails, setProjectDetails] = useState([
    {
      name: "Project Name",
      value: "Project 1",
    },
    {
      name: "Project Status",
      value: "Ongoing",
    },
    {
      name: "Client Name",
      value: "John Doe",
    },
  ]);

  const OverduePayments = [
    {
      name: "Material",
      desc: "Material's budget",
      value: "₹30,000",
      value_label: "Budget",
    },
    {
      name: "Labor",
      desc: "Labor's budget",
      value: "₹40,000",
      value_label: "Budget",
    },
  ];

  const DelayedTasks = [
    {
      name: "Task 1",
      desc: "Start: 05 Oct 25",
      value: "28",
      value_label: "days",
    },
    {
      name: "Task 2",
      desc: "Start: 05 Oct 25",
      value: "28",
      value_label: "days",
    },
  ];

  return (
    <Layout title="Dashboard">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="relative flex flex-col items-center">
              <PieChart width={170} height={90}>
                <Pie
                  data={ProjectProgressStatusChart}
                  cx={80}
                  cy={80}
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={0}
                  dataKey="value"
                >
                  <Tooltip contentStyle={{ fontSize: "14px" }} />
                </Pie>
              </PieChart>
              <label className="text-sm font-bold text-gray-900 text-center -mt-10">
                50% <br />
                Completed
              </label>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-600">
                    Planned Start Date:
                  </span>
                  <span className="w-[max-content] text-sm font-bold text-gray-900 bg-gray-100 p-1 px-2 rounded-md">
                    01 Jan 2024
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-600">
                    Planned End Date:
                  </span>
                  <span className="w-[max-content] text-sm font-bold text-gray-900 bg-gray-100 p-1 px-2 rounded-md">
                    01 Jan 2024
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-600">
                    Actual Start Date:
                  </span>
                  <span className="w-[max-content] text-sm font-bold text-gray-900 bg-gray-100 p-1 px-2 rounded-md">
                    01 Jan 2024
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-600">
                    Actual End Date:
                  </span>
                  <span className="w-[max-content] text-sm font-bold text-gray-900 bg-gray-100 p-1 px-2 rounded-md">
                    01 Jan 2024
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="relative flex flex-col items-center">
              <PieChart width={170} height={90}>
                <Pie
                  data={ProjectTasksChart}
                  cx={80}
                  cy={80}
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={0}
                  dataKey="value"
                >
                  <Tooltip contentStyle={{ fontSize: "14px" }} />
                </Pie>
              </PieChart>
              <label className="text-sm text-gray-900 text-center -mt-10">
                Tasks
                <br />
                10/100
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {ProjectTasksChart.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-md mb-1"
                    style={{ backgroundColor: item.fill }}
                  ></span>
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    {item.name} {item.value || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full grid grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            {ProjectDetails?.map((item, index) => (
              <div key={index} className="flex flex-col gap-1">
                <span className="text-xs text-gray-600 whitespace-nowrap">
                  {item.name}:
                </span>
                <span className="w-[max-content] text-sm font-bold text-gray-900 bg-gray-100 p-1 px-2 rounded-md">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <CustomBarChart
            data={FinanceHealth}
            title="Financial Health"
            color="#ef4444"
            showLegend={true}
          />
          <CustomPieChart
            data={ExpensesBreakdown}
            title="Expense Breakdown"
            showLegend={true}
          />
          <CustomBarChart
            data={FinanceSummary}
            title="Financial Breakdown"
            color="#ef4444"
            showLegend={true}
            customSeries={true}
            categories={["Client", "Labour", "Material"]}
          />
        </div>
        <div className="grid grid-cols-1  gap-4">
          <CustomBarChart
            data={AttendanceSummary}
            title="Labour Attendance (last 7 days)"
            color="#ef4444"
            showLegend={true}
            customSeries={true}
            categories={AttendanceSummaryLabels}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RecordsChart
            data={OverduePayments}
            title="Overdue Payments"
            color="#ef4444"
          />
          <RecordsChart
            data={DelayedTasks}
            title="Delayed Tasks"
            color="#f59e0b"
          />
          <RecordsChart
            data={DelayedTasks}
            title="Delayed Tasks"
            color="#f59e0b"
          />
        </div>
      </div>
    </Layout>
  );
};
