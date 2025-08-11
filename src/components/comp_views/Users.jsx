// Users.jsx
import React, { useState, useEffect } from "react";
import UserList from "./UserList";
import { supabase } from "../../supabaseClient";

const Users = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [statusMsg, setStatusMsg] = useState("");
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch(
        "https://yowckahgoxqfikadirov.supabase.co/functions/v1/list-users",
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );

      const data = await res.json();
      console.log("Response from Edge Function:", data);

      if (res.ok) {
        setUsers(Array.isArray(data.users) ? data.users : []);
      } else {
        console.error(data.error || "Unknown error");
        alert(data.error || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddUser = async (role = "user") => {
    setStatusMsg(`Creating ${role}...`);

    const res = await fetch(
      "https://yowckahgoxqfikadirov.supabase.co/functions/v1/create-user",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      setStatusMsg(`❌ ${result.error?.message || "Failed to create user"}`);
    } else {
      setStatusMsg(`✅ ${role === "admin" ? "Admin" : "User"} created successfully!`);
      setFormData({ name: "", email: "", password: "" });

      fetchUsers();

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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md m-6">
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
       {loading ? (
        <p>Loading the Table</p>
      ) : (
      <UserList users={users} setUsers={setUsers} />
      )}
    </div>
  );
};

export default Users;
