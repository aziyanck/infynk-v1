import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { ThreeDot } from "react-loading-indicators";
import { Menu } from 'lucide-react';

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Dashboard from "../components/comp_views/Dashboard";
import Users from "../components/comp_views/Users";
import Cards from "../components/comp_views/Cards";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    // Load active tab from localStorage or default to "dashboard"
    return localStorage.getItem("adminActiveTab") || "dashboard";
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile toggle

  const [sessionUser, setSessionUser] = useState(null);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem("adminActiveTab");

      // Sign out from Supabase
      await supabase.auth.signOut();

      // Navigate to admin login
      navigate("/admin");
    } catch (error) {
      console.error("Error during logout:", error);
      // Still navigate even if there's an error
      navigate("/admin");
    }
  };

  useEffect(() => {
    if (sessionUser) return;
    const checkAdminRole = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (!session) {
        navigate("/admin"); // Not logged in
        return;
      }

      setSessionUser(session.user);
      const role = session.user.app_metadata?.role;

      if (role !== "admin") {
        navigate("/admin"); // Not an admin
        return;
      }

      setLoading(false); // Allowed
    };

    checkAdminRole();
  }, [navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <div className="p-6"><Dashboard /></div>;
      case "users":
        return <div className="p-6"><Users /></div>;
      case "cards":
        return <div className="p-6"><Cards /></div>;
      case "settings":
        return <div className="p-6">⚙️ Settings Panel</div>;
      default:
        return <div className="p-6"><Dashboard /></div>;
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <ThreeDot variant="pulsate" color="#3194cc" size="large" text="" textColor="" />
      </div>
    );

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <header className="bg-white w-screen px-6 py-4 shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-700 hidden md:block">Dashboard</h1>
        <div className="md:hidden">
          <Menu
            className="w-6 h-6 text-gray-700 cursor-pointer"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>
        <div className="text-gray-500">Welcome, {sessionUser?.user_metadata?.full_name || sessionUser?.user_metadata?.name || 'User'}</div>
      </header>
      <div className="flex flex-1">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
