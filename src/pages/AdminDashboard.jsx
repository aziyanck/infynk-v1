import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { ThreeDot } from "react-loading-indicators";
import { Menu } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Dashboard from "../components/comp_views/Dashboard";
import Users from "../components/comp_views/Users";
import Cards from "../components/comp_views/Cards";
import Payments from "../components/comp_views/Payments";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("adminActiveTab") || "dashboard";
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState(null);

  // Centralized Data State
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("adminActiveTab");
      await supabase.auth.signOut();
      navigate("/admin");
    } catch (error) {
      console.error("Error during logout:", error);
      navigate("/admin");
    }
  };

  const refreshData = async () => {
    try {
      setDataLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      // Parallel Fetch
      const [usersRes, paymentsRes] = await Promise.all([
        fetch(
          "https://yowckahgoxqfikadirov.supabase.co/functions/v1/list-users",
          {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }
        ),
        fetch(
          "https://yowckahgoxqfikadirov.supabase.co/functions/v1/list-payments",
          {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }
        ),
      ]);

      const usersJson = await usersRes.json();
      const paymentsJson = await paymentsRes.json();

      if (usersRes.ok) setUsers(usersJson.users || []);
      else console.error("Failed to fetch users:", usersJson.error);

      if (paymentsRes.ok) setPayments(paymentsJson.payments || []);
      else console.error("Failed to fetch payments:", paymentsJson.error);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (sessionUser) return;
    const checkAdminRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/admin");
        return;
      }

      setSessionUser(session.user);
      const role = session.user.app_metadata?.role;

      if (role !== "admin") {
        navigate("/admin");
        return;
      }

      setLoading(false);
      // Determine if we need to fetch data on initial load
      refreshData();
    };

    checkAdminRole();
  }, [navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="h-full overflow-y-auto p-6">
            <Dashboard
              users={users}
              payments={payments}
              loading={dataLoading}
              onRefresh={refreshData}
            />
          </div>
        );
      case "users":
        return (
          <div className="h-full overflow-y-auto p-6">
            <Users
              users={users}
              setUsers={setUsers} // Allow local optimism or updates if needed
              loading={dataLoading}
              onRefresh={refreshData}
            />
          </div>
        );
      case "payments":
        return (
          <div className="h-full p-6 flex flex-col">
            <Payments
              payments={payments}
              setPayments={setPayments}
              loading={dataLoading}
              onRefresh={refreshData}
            />
          </div>
        );
      case "cards":
        return (
          <div className="h-full overflow-y-auto p-6">
            <Cards />
          </div>
        );
      case "settings":
        return (
          <div className="h-full overflow-y-auto p-6">⚙️ Settings Panel</div>
        );
      default:
        return (
          <div className="h-full overflow-y-auto p-6">
            <Dashboard
              users={users}
              payments={payments}
              loading={dataLoading}
              onRefresh={refreshData}
            />
          </div>
        );
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <ThreeDot
          variant="pulsate"
          color="#3194cc"
          size="large"
          text=""
          textColor=""
        />
      </div>
    );

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <header className="bg-white w-screen px-6 py-4 shadow-sm flex justify-between items-center z-10 relative">
        <h1 className="text-xl font-semibold text-gray-700 hidden md:block">
          Dashboard
        </h1>
        <div className="md:hidden">
          <Menu
            className="w-6 h-6 text-gray-700 cursor-pointer"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>
        <div className="text-gray-500">
          Welcome,{" "}
          {sessionUser?.user_metadata?.full_name ||
            sessionUser?.user_metadata?.name ||
            "User"}
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onLogout={handleLogout}
        />
        <main className="flex-1 h-full relative overflow-hidden bg-gray-100">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
