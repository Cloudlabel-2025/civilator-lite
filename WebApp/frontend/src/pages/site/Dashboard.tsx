import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../../components/Layout/Layout";
import { CustomPieChart } from "../../components/Charts/PieChart";
import { CustomBarChart } from "../../components/Charts/BarChart";
import { RecordsChart } from "../../components/Charts/RecordsChart";
import { mockSites } from "../../data/mockData";

import NoDataFound from "../../components/Common/NoDataFound";
import Utils from "../../helpers/utils";
import { PieChart, Pie, Tooltip } from "recharts";

/* handlers */
import DashboardHandler from "../../handler/dashboard";
const dashboardHandler = new DashboardHandler();

export const Dashboard: React.FC = () => {
  const { siteId } = useParams();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardHandler.getSiteDashboard({ site_id: siteId });
      if (response && response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (siteId) {
      fetchDashboardData();
    }
  }, [siteId]);

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout title="Dashboard">
        <NoDataFound message="Unable to load dashboard data" />
      </Layout>
    );
  }

  const { finance, task, expense_breakdown, finance_breakdown, overdue_payments, delayed_tasks, site } = dashboardData;

  const FinanceHealth = [
    {
      name: "Project Value",
      value: finance?.estimated || 0,
      color: "#3b82f6",
    },
    {
      name: "Total Expense",
      value: finance?.expenses || 0,
      color: "#f59e0b",
    },
    {
      name: "Total Received",
      value: finance?.received || 0,
      color: "#b916f9ff",
    },
    {
      name: "Profit/Loss",
      value: finance?.profit || 0,
      color: finance?.profit >= 0 ? "#33c87e" : "#ef4444",
    },
  ];

  const ExpensesBreakdown = [
    {
      name: "Material",
      value: expense_breakdown?.material || 0,
      color: "#f59e0b",
    },
    {
      name: "Labor",
      value: expense_breakdown?.labor || 0,
      color: "#ef4444",
    },
    {
      name: "Petty Cash",
      value: expense_breakdown?.petty_cash || 0,
      color: "#1091b9ff",
    },
    {
      name: "Advances",
      value: expense_breakdown?.vendor_advance || 0,
      color: "#b916f9ff",
    },
    {
      name: "Other",
      value: expense_breakdown?.other || 0,
      color: "#b1b1b1ff",
    },
  ].filter(item => item.value > 0);

  const FinanceSummaryData = [
    {
      name: "Total Amount",
      value: [
        finance_breakdown?.client?.total || 0,
        finance_breakdown?.labour?.total || 0,
        finance_breakdown?.material?.total || 0,
      ],
      color: "#0065ff",
    },
    {
      name: "Paid Amount",
      value: [
        finance_breakdown?.client?.paid || 0,
        finance_breakdown?.labour?.paid || 0,
        finance_breakdown?.material?.paid || 0,
      ],
      color: "#33c87e",
    },
    {
      name: "Pending Amount",
      value: [
        finance_breakdown?.client?.pending || 0,
        finance_breakdown?.labour?.pending || 0,
        finance_breakdown?.material?.pending || 0,
      ],
      color: "#ff5b5b",
    },
  ];


  const ProjectProgressStatusChart = [
    {
      name: "Completed",
      fill: "#0088FE",
      value: site?.site_status_percentage || 0,
    },
    {
      name: "Remaining",
      fill: "#dee2e6",
      value: 100 - (site?.site_status_percentage || 0),
    },
  ];

  const totalTasks = (task?.not_started || 0) + (task?.in_progress || 0) + (task?.completed || 0) + (task?.delayed || 0) + (task?.upcoming || 0);

  const ProjectTasksChartData = [
    {
      name: "Not Started",
      value: task?.not_started || 0,
      fill: "#dee2e6",
    },
    {
      name: "In Progress",
      value: task?.in_progress || 0,
      fill: "#ebb840",
    },
    {
      name: "Completed",
      value: task?.completed || 0,
      fill: "#68d083",
    },
    {
      name: "Upcoming",
      value: task?.upcoming || 0,
      fill: "#8cc7fa",
    },
    {
      name: "Delayed",
      value: task?.delayed || 0,
      fill: "#e6642e",
    },
  ].filter(item => item.value > 0);

  const ProjectInfo = [
    {
      name: "Project Name",
      value: site?.name || "N/A",
    },
    {
      name: "Status",
      value: site?.status || "N/A",
    },
    {
      name: "Client",
      value: site?.client_name || "N/A",
    },
  ];

  const OverduePaymentsData = overdue_payments?.map((p: any) => ({
    name: "Payment",
    desc: `Due: ${new Date(p.date).toLocaleDateString()}`,
    value: Utils.formatCurrency(p.amount),
    value_label: "Overdue",
  })) || [];

  const DelayedTasksData = delayed_tasks?.map((t: any) => ({
    name: t.name,
    desc: t.date ? `Deadline: ${new Date(t.date).toLocaleDateString()}` : "No deadline",
    value: t.days.toString(),
    value_label: "days",
  })) || [];

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
                {site?.site_status_percentage || 0}% <br />
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
                    {site?.planned_start_date ? new Date(site.planned_start_date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-600">
                    Planned End Date:
                  </span>
                  <span className="w-[max-content] text-sm font-bold text-gray-900 bg-gray-100 p-1 px-2 rounded-md">
                    {site?.planned_end_date ? new Date(site.planned_end_date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-600">
                    Actual Start Date:
                  </span>
                  <span className="w-[max-content] text-sm font-bold text-gray-900 bg-gray-100 p-1 px-2 rounded-md">
                    {site?.actual_start_date ? new Date(site.actual_start_date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-600">
                    Actual End Date:
                  </span>
                  <span className="w-[max-content] text-sm font-bold text-gray-900 bg-gray-100 p-1 px-2 rounded-md">
                    {site?.actual_end_date ? new Date(site.actual_end_date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="relative flex flex-col items-center">
              <PieChart width={170} height={90}>
                <Pie
                  data={ProjectTasksChartData.length > 0 ? ProjectTasksChartData : [{ name: "No Tasks", value: 1, fill: "#f3f4f6" }]}
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
                {task?.completed || 0}/{totalTasks}
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {ProjectTasksChartData.map((item, index) => (
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
          <div className="w-full grid grid-cols-1 gap-2 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            {ProjectInfo?.map((item, index) => (
              <div key={index} className="flex items-center justify-between gap-1 border-b border-gray-50 pb-1">
                <span className="text-xs text-gray-600 whitespace-nowrap">
                  {item.name}:
                </span>
                <span className="text-sm font-bold text-gray-900">
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
            data={ExpensesBreakdown.length > 0 ? ExpensesBreakdown : [{ name: "No Expenses", value: 1, color: "#f3f4f6" }]}
            title="Expense Breakdown"
            showLegend={true}
          />
          <CustomBarChart
            data={FinanceSummaryData}
            title="Financial Breakdown"
            color="#ef4444"
            showLegend={true}
            customSeries={true}
            categories={["Client", "Labour", "Material"]}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RecordsChart
            data={OverduePaymentsData}
            title="Overdue Payments"
            color="#ef4444"
          />
          <RecordsChart
            data={DelayedTasksData}
            title="Delayed Tasks"
            color="#ef4444"
          />
          <RecordsChart
            data={DelayedTasksData} // Reusing for placeholder as in original
            title="Action Items"
            color="#f59e0b"
          />
        </div>
      </div>
    </Layout>
  );
};
