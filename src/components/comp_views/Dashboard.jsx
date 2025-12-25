import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import {
  Loader2,
  Users,
  Wallet,
  TrendingUp,
  Download,
  MoreHorizontal,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState([]);
  const [userData, setUserData] = useState([]);

  // Metrics
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeUsersCount, setActiveUsersCount] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // 1. Fetch Payments
      const paymentsRes = await fetch(
        "https://yowckahgoxqfikadirov.supabase.co/functions/v1/list-payments",
        { headers: { Authorization: `Bearer ${session?.access_token}` } }
      );
      const paymentsJson = await paymentsRes.json();
      const payments = paymentsJson.payments || [];

      // 2. Fetch Users
      const usersRes = await fetch(
        "https://yowckahgoxqfikadirov.supabase.co/functions/v1/list-users",
        { headers: { Authorization: `Bearer ${session?.access_token}` } }
      );
      const usersJson = await usersRes.json();
      const users = usersJson.users || [];

      processDashboardData(payments, users);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processDashboardData = (payments, users) => {
    // --- REVENUE PROCESSING ---
    let revenueSum = 0;
    const revenueByMonth = {};

    payments.forEach((payment) => {
      if (!payment.created_at) return;

      // Extract amount
      let amount = 0;
      if (payment.plan) {
        const match = payment.plan.match(/(\d+)\/-?/);
        if (match && match[1]) amount = parseInt(match[1], 10);
        else {
          if (payment.plan.includes("999")) amount = 999;
          else if (payment.plan.includes("1299")) amount = 1299;
          else if (payment.plan.includes("1399")) amount = 1399;
        }
      }
      revenueSum += amount;

      const date = new Date(payment.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      const label = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }); // e.g., "Jan 2024"
      const shortLabel = date.toLocaleDateString("en-US", { month: "short" }); // e.g., "Jan"

      if (!revenueByMonth[key]) {
        revenueByMonth[key] = {
          name: shortLabel,
          fullLabel: label,
          revenue: 0,
          sortKey: key,
        };
      }
      revenueByMonth[key].revenue += amount;
    });

    // Convert to array and sort
    const sortedRevenueData = Object.values(revenueByMonth).sort((a, b) =>
      a.sortKey.localeCompare(b.sortKey)
    );
    setPaymentData(sortedRevenueData);
    setTotalRevenue(revenueSum);

    // --- USER PROCESSING ---
    // Count active users (current snapshot)
    const activeUsers = users.filter((u) => u.route_status === "Active");
    setActiveUsersCount(activeUsers.length);

    // Group Active Users by Month they were CREATED (Growth metric)
    const usersByMonth = {};

    users.forEach((user) => {
      // Only count active users for the graph? Or all users?
      // "Active Users" graph usually implies growth of active users over time.
      // Let's stick to users who are CURRENTLY active, grouped by when they joined.
      if (user.route_status !== "Active" || !user.created_at) return;

      const date = new Date(user.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      const shortLabel = date.toLocaleDateString("en-US", { month: "short" });

      if (!usersByMonth[key]) {
        usersByMonth[key] = {
          name: shortLabel,
          activeUsers: 0,
          sortKey: key,
        };
      }
      usersByMonth[key].activeUsers += 1;
    });

    const sortedUserData = Object.values(usersByMonth).sort((a, b) =>
      a.sortKey.localeCompare(b.sortKey)
    );
    setUserData(sortedUserData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (value) => `₹${value.toLocaleString("en-IN")}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-sans text-gray-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-gray-500 text-sm mt-1">
            Financial performance and user growth statistics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            Last 30 Days
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {formatCurrency(totalRevenue)}
            </p>
            <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>12.5%</span>
              <span className="text-gray-400 font-normal ml-1">
                vs last month
              </span>
            </div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-green-600">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        {/* Active Users Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              Active Users
            </h3>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {activeUsersCount.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>8.2%</span>
              <span className="text-gray-400 font-normal ml-1">
                vs last month
              </span>
            </div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Monthly Revenue</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 w-full min-h-0">
            {paymentData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No revenue data yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={paymentData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value) => [formatCurrency(value), "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Active Users Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Active Users</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 w-full min-h-0">
            {userData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No active user data yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={userData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  barSize={20}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    cursor={{ fill: "transparent" }}
                  />
                  <Bar
                    dataKey="activeUsers"
                    name="Active Users"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
