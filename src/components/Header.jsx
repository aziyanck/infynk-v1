// src/components/Header.jsx
import React from "react";

const Header = () => {
  return (
    <header className="bg-white w-screen px-6 py-4 shadow-sm flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-700">Dashboard</h1>
      <div className="text-gray-500">Welcome, Admin</div>
    </header>
  );
};

export default Header;
