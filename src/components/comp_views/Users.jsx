import React, { useState } from "react";
import UserList from "./UserList";
const Users = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [statusMsg, setStatusMsg] = useState("");

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddUser = async (role = "user") => {
    setStatusMsg(`Creating ${role}...`);

    const res = await fetch("https://yowckahgoxqfikadirov.supabase.co/functions/v1/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role, // pass the role to Edge Function
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      setStatusMsg(`❌ ${result.error?.message || "Failed to create user"}`);
    } else {
      setStatusMsg(`✅ ${role === "admin" ? "Admin" : "User"} created successfully!`);
      setFormData({ name: "", email: "", password: "" });
      setTimeout(() => {
        setShowModal(false);
        setStatusMsg("");
      }, 2000);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between h-auto p-4">
        <h1 className="text-xl font-semibold">Users</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add User
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Add New User</h2>

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full mb-3 px-3 py-2 border rounded-md"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full mb-3 px-3 py-2 border rounded-md"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full mb-4 px-3 py-2 border rounded-md"
                required
              />

              {statusMsg && (
                <p className="text-sm mb-3 text-center text-gray-700">{statusMsg}</p>
              )}

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleAddUser("user")}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Create User
                </button>

                <button
                  onClick={() => handleAddUser("admin")}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Create Admin
                </button>

                <button
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ name: "", email: "", password: "" });
                    setStatusMsg("");
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <UserList />
    </div>
  );
};

export default Users;
