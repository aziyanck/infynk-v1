import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import {
  Loader2,
  Users,
  Wallet,
  TrendingUp,
  Download,
  MoreHorizontal,
  ChevronDown,
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
  const [paymentData, setPaymentData] = useState([]); // For Chart (aggregated)
  const [userData, setUserData] = useState([]); // For Chart (aggregated)

  // Raw Data for filtering stats
  const [rawPayments, setRawPayments] = useState([]);
  const [rawUsers, setRawUsers] = useState([]);

  // Filter State
  const [timeRange, setTimeRange] = useState(30); // Default 30 days

  // Metrics (Filtered)
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
      setRawPayments(payments);

      // 2. Fetch Users
      const usersRes = await fetch(
        "https://yowckahgoxqfikadirov.supabase.co/functions/v1/list-users",
        { headers: { Authorization: `Bearer ${session?.access_token}` } }
      );
      const usersJson = await usersRes.json();
      const users = usersJson.users || [];
      setRawUsers(users);

      processChartData(payments, users);
      calculateStats(payments, users, 30); // Initial calculation
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // calculateStats filters raw data based on the selected time range
  // and updates the stats cards.
  const calculateStats = (payments, users, days) => {
    const now = new Date();
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - days);

    // --- FILTER & CALC REVENUE ---
    let revenueSum = 0;
    payments.forEach((payment) => {
      if (!payment.created_at) return;
      const paymentDate = new Date(payment.created_at);

      if (paymentDate >= pastDate && paymentDate <= now) {
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
      }
    });
    setTotalRevenue(revenueSum);

    // --- CALC ACTIVE USERS (TOTAL) ---
    // User requested active users NOT be affected by the time filter.
    // So we just count ALL users with 'Active' status, ignoring the date range.
    const totalActiveUsers = users.filter((u) => u.route_status === "Active");
    setActiveUsersCount(totalActiveUsers.length);
  };

  // processChartData handles the aggregation for the graphs (Always All Data)
  const processChartData = (payments, users) => {
    // --- REVENUE CHART ---
    const revenueByMonth = {};
    payments.forEach((payment) => {
      if (!payment.created_at) return;
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
      const date = new Date(payment.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      const label = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      const shortLabel = date.toLocaleDateString("en-US", { month: "short" });

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
    setPaymentData(
      Object.values(revenueByMonth).sort((a, b) =>
        a.sortKey.localeCompare(b.sortKey)
      )
    );

    // --- USER CHART ---
    const usersByMonth = {};
    users.forEach((user) => {
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
    setUserData(
      Object.values(usersByMonth).sort((a, b) =>
        a.sortKey.localeCompare(b.sortKey)
      )
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Re-calculate stats when timeRange changes (using raw data if available)
  useEffect(() => {
    if (rawPayments.length > 0 && rawUsers.length > 0) {
      calculateStats(rawPayments, rawUsers, timeRange);
    }
  }, [timeRange, rawPayments, rawUsers]);

  const formatCurrency = (value) => `₹${value.toLocaleString("en-IN")}`;
  const [isExporting, setIsExporting] = useState(false);

  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      try {
        const reportData = {};
        // ... (Existing export logic remains same, but using chartData which is 'paymentData' and 'userData')
        // Re-using aggregations from chart data to export 'Monthly' report as before.

        paymentData.forEach((item) => {
          if (!reportData[item.sortKey])
            reportData[item.sortKey] = {
              month: item.fullLabel,
              revenue: 0,
              activeUsers: 0,
            };
          reportData[item.sortKey].revenue = item.revenue;
        });
        userData.forEach((item) => {
          if (!reportData[item.sortKey]) {
            const [year, month] = item.sortKey.split("-");
            const date = new Date(year, month - 1);
            const label = date.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });
            reportData[item.sortKey] = {
              month: label,
              revenue: 0,
              activeUsers: 0,
            };
          }
          reportData[item.sortKey].activeUsers = item.activeUsers;
        });

        const csvRows = [["Month", "Revenue (INR)", "New Active Users"]];
        Object.keys(reportData)
          .sort()
          .forEach((key) => {
            const row = reportData[key];
            csvRows.push([`"${row.month}"`, row.revenue, row.activeUsers]);
          });
        csvRows.push([]);
        // Note: Exporting 'Total' of the REPORT (which is all time) or Selected Time Range?
        // Usually "Export Report" exports what's seen or all data.
        // Let's keep it consistent with the charts (All Data) for now as typical "Monthwise Report".
        // But the Total row below used 'totalRevenue' which is now FILTERED.
        // Let's summing up the REPORT rows for consistency in the CSV.
        const reportTotalRevenue = Object.values(reportData).reduce(
          (a, b) => a + b.revenue,
          0
        );
        const reportTotalUsers = Object.values(reportData).reduce(
          (a, b) => a + b.activeUsers,
          0
        );

        csvRows.push([
          "Total (All Time)",
          reportTotalRevenue,
          reportTotalUsers,
        ]);

        const csvContent =
          "data:text/csv;charset=utf-8," +
          csvRows.map((e) => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute(
          "download",
          `dashboard_report_${new Date().toISOString().split("T")[0]}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Export failed:", error);
        alert("Failed to export report.");
      } finally {
        setIsExporting(false);
      }
    }, 500);
  };

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
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-8 rounded-lg text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm cursor-pointer"
            >
              <option value={7}>Last 7 Days</option>
              <option value={15}>Last 15 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={60}>Last 60 Days</option>
              <option value={90}>Last 90 Days</option>
              <option value={365}>Last 1 Year</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={handleExportReport}
            disabled={isExporting}
            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Export Report
              </>
            )}
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
              {/* Trend calculation is complex without previous period data. Keeping static or could compare to previous X days if data allows. */}
              <span>--</span>
              <span className="text-gray-400 font-normal ml-1">
                in selected period
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
              <span>--</span>
              <span className="text-gray-400 font-normal ml-1">
                joined in period
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
