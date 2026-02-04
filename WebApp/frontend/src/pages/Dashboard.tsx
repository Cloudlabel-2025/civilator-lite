import React from "react";
import { Layout } from "../components/Layout/Layout";
import { StatsCard } from "../components/Common/StatsCard";
import { CustomPieChart } from "../components/Charts/PieChart";
import { CustomBarChart } from "../components/Charts/BarChart";
import {
  Building2,
  Construction,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  ReceiptText,
} from "lucide-react";
import { mockSites, mockExpenses } from "../data/mockData";

export const Dashboard: React.FC = () => {
  // Calculate stats
  const totalSites = mockSites.length;
  const ongoingSites = mockSites.filter(
    (site) => site.status === "ongoing"
  ).length;
  const completedSites = mockSites.filter(
    (site) => site.status === "completed"
  ).length;

  // Calculate overall profit/loss
  const totalEstimate = mockSites.reduce(
    (sum, site) => sum + site.estimateAmount,
    0
  );
  const totalExpense = mockSites.reduce(
    (sum, site) => sum + site.totalExpense,
    0
  );
  const totalProfit = totalEstimate - totalExpense;

  // Profit/Loss pie chart data
  const profitLossData = [
    {
      name: "Profit",
      value: totalProfit > 0 ? totalProfit : 0,
      color: "#10b981",
    },
    { name: "Expenses", value: totalExpense, color: "#ef4444" },
  ];

  // Expense breakdown by category
  const expensesByCategory = mockExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const expenseBreakdownData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  return (
    <Layout title="Dashboard">
      <div className="flex flex-col gap-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <StatsCard
            title="Total Sites"
            value={totalSites}
            icon={Building2}
            iconColor="text-blue-600"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Ongoing Sites"
            value={ongoingSites}
            icon={Construction}
            iconColor="text-orange-600"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Completed Sites"
            value={completedSites}
            icon={CheckCircle}
            iconColor="text-green-600"
            trend={{ value: 15, isPositive: true }}
          />
          <StatsCard
            title="Overall Expense"
            value={`₹${(totalProfit / 100000).toFixed(1)}L`}
            icon={ReceiptText}
            iconColor={"text-red-600"}
            trend={{ value: 5, isPositive: totalProfit >= 0 }}
          />
          <StatsCard
            title="Overall Profit"
            value={`₹${(totalProfit / 100000).toFixed(1)}L`}
            icon={totalProfit > 0 ? TrendingUp : TrendingDown}
            iconColor={totalProfit >= 0 ? "text-green-600" : "text-red-600"}
            trend={{ value: 5, isPositive: totalProfit >= 0 }}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Profit/Loss Chart */}
          <CustomPieChart data={profitLossData} title="Overall Profit/Loss" />

          {/* Expense Breakdown */}
          <CustomBarChart
            data={expenseBreakdownData}
            title="Expense Breakdown by Category"
            color="#ef4444"
          />
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Site Status Distribution */}
          <CustomPieChart
            data={[
              { name: "Ongoing", value: ongoingSites, color: "#f97316" },
              { name: "Completed", value: completedSites, color: "#22c55e" },
              {
                name: "Planning",
                value: mockSites.filter((s) => s.status === "planning").length,
                color: "#3b82f6",
              },
              {
                name: "On Hold",
                value: mockSites.filter((s) => s.status === "on-hold").length,
                color: "#ef4444",
              },
            ]}
            title="Site Status Distribution"
          />

          {/* Monthly Revenue Trend (Mock Data) */}
          <CustomBarChart
            data={[
              { name: "Jan", value: 2000000 },
              { name: "Feb", value: 2500000 },
              { name: "Mar", value: 1800000 },
              { name: "Apr", value: 3200000 },
              { name: "May", value: 2800000 },
              { name: "Jun", value: 3500000 },
            ]}
            title="Monthly Revenue Trend"
            color="#10b981"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activities
          </h3>
          <div className="flex flex-col gap-4">
            {mockSites.slice(0, 3).map((site) => (
              <div
                key={site.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{site.name}</h4>
                    <p className="text-sm text-gray-600">
                      {site.completionPercentage}% completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ₹{(site.estimateAmount / 100000).toFixed(1)}L
                  </p>
                  <p className="text-xs text-gray-600">Budget</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
