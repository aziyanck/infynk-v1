import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Dashboard from "../components/comp_views/Dashboard";
import Users from "../components/comp_views/Users";
import Cards from "../components/comp_views/Cards";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminRole = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (!session) {
        navigate("/admin"); // Not logged in
        return;
      }

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

  if (loading) return <div className="p-6">🔒 Verifying admin access...</div>;

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
