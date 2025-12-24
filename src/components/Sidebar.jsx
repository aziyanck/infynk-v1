// src/components/Sidebar.jsx
import React from "react";
import {
  faHome,
  faUser,
  faIdBadge,
  faSliders,
  faSignOutAlt,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Sidebar = ({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  onLogout,
}) => {
  const navItems = [
    { label: "Dashboard", icon: faHome, key: "dashboard" },
    { label: "Users", icon: faUser, key: "users" },
    { label: "Payments", icon: faCreditCard, key: "payments" },
    { label: "Cards", icon: faIdBadge, key: "cards" },
    { label: "Settings", icon: faSliders, key: "settings" },
  ];

  const handleMenuItemClick = (key) => {
    setActiveTab(key);
    // Close sidebar on mobile after selecting an item
    if (setIsSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        w-64 h-full bg-white shadow-md flex-col z-50
        md:flex md:relative
        ${isSidebarOpen ? "fixed left-0 top-0 flex" : "hidden md:flex"}
      `}
      >
        <div className="px-6 py-4 text-xl font-bold border-b">Admin Panel</div>
        <nav className="flex-1 px-4 py-6 space-y-4">
          {navItems.map((item) => (
            <div
              key={item.key}
              className={`flex items-center gap-3 cursor-pointer px-2 py-2 rounded-md ${
                activeTab === item.key
                  ? "bg-gray-200 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleMenuItemClick(item.key)}
            >
              <FontAwesomeIcon icon={item.icon} />
              {item.label}
            </div>
          ))}
        </nav>
        <div className="px-6 py-4 border-t">
          <button
            className="flex items-center gap-2 text-red-600 hover:underline"
            onClick={onLogout}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
