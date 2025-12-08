// UserList.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import AssignRoute from "./AssignRoute";
import { removeRouteFromUser } from "../../services/adminService"
import UserInfo from "./UserInfo";

import { ArrowUpDown, RefreshCw, Filter } from "lucide-react";

const UserList = ({
  users,
  setUsers,
  searchTerm,
  setSearchTerm,
  sortConfig,
  setSortConfig,
  fetchUsers,
  filters,
  setFilters,
}) => {
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // 👈 Track selected user
  const [viewingUser, setViewingUser] = useState(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const handleRemoveRoute = async (user) => {
    try {
      await removeRouteFromUser(user.id);
      alert("Route removed successfully!");

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id
            ? { ...u, route_id: null, expiry_date: null, route_status: null }
            : u
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to remove route: " + error.message);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg relative">
      <div className="flex flex-col gap-4 mb-4">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">All Users</h2>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />

            <button
              onClick={fetchUsers}
              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center justify-center shrink-0"
              title="Refresh User List"
            >
              <RefreshCw size={18} />
            </button>

            <button
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              className={`px-3 py-2 rounded-md transition-colors flex items-center justify-center shrink-0 ${isOptionsOpen
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              title="Toggle Filters & Sort"
            >
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Collapsible Options Area */}
        <div
          className={`flex flex-col md:flex-row gap-4 p-4 bg-gray-50 border rounded-lg transition-all duration-300 ease-in-out ${isOptionsOpen ? "opacity-100 max-h-96" : "opacity-0 max-h-0 hidden"
            }`}
        >
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center border-b md:border-b-0 md:border-r border-gray-300 pb-4 md:pb-0 md:pr-4">
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Show Users:
            </span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showUnassigned}
                onChange={(e) =>
                  setFilters({ ...filters, showUnassigned: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Unassigned</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showInactive}
                onChange={(e) =>
                  setFilters({ ...filters, showInactive: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Inactive</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showExpired}
                onChange={(e) =>
                  setFilters({ ...filters, showExpired: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Expired</span>
            </label>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Sort By:
            </span>
            <select
              value={sortConfig.key}
              onChange={(e) =>
                setSortConfig({ ...sortConfig, key: e.target.value })
              }
              className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Default</option>
              <option value="route_id">ID</option>
              <option value="name">Name</option>
            </select>

            <button
              onClick={() =>
                setSortConfig((prev) => ({
                  ...prev,
                  direction: prev.direction === "asc" ? "desc" : "asc",
                }))
              }
              className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-center"
              title="Toggle Sort Direction"
            >
              <ArrowUpDown size={16} />
            </button>
          </div>
        </div>
      </div>


      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Sl. No</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              {/* <th className="px-4 py-2 text-left">Joined</th> */}
              <th className="px-4 py-2 text-left">Route ID</th>
              <th className="px-4 py-2 text-left">Expire On</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td
                    className="px-4 py-2 text-blue-600 hover:underline cursor-pointer"
                    onClick={() => setViewingUser(user)}
                  >
                    {user.name || "—"}
                  </td>

                  <td className="px-4 py-2">{user.email}</td>
                  {/* <td className="px-4 py-2">
                    {user.created_at
                      ? new Date(user.created_at).toISOString().split("T")[0]
                      : "-"}
                  </td> */}
                  <td className="px-4 py-2">{user.route_id || "—"}</td>
                  <td className="px-4 py-2">
                    {user.expiry_date
                      ? new Date(user.expiry_date).toISOString().split("T")[0]
                      : "-"}
                  </td>

                  <td className="px-4 py-2">
                    {user.route_id ? (
                      <button
                        onClick={async () => {
                          const newStatus = user.route_status === "Active" ? "Inactive" : "Active";

                          try {
                            const {
                              data: { session },
                            } = await supabase.auth.getSession();

                            const res = await fetch(
                              "https://yowckahgoxqfikadirov.supabase.co/functions/v1/toggle-route-status",
                              {
                                method: "POST",
                                headers: {
                                  Authorization: `Bearer ${session?.access_token}`,
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  route_id: user.route_id,
                                  is_active: newStatus === "Active",
                                }),
                              }
                            );

                            const result = await res.json();

                            if (res.ok) {
                              setUsers((prevUsers) =>
                                prevUsers.map((u) =>
                                  u.id === user.id ? { ...u, route_status: newStatus } : u
                                )
                              );
                            } else {
                              alert(result.error || "Failed to toggle route status");
                            }
                          } catch (err) {
                            console.error(err);
                            alert("Error toggling route status");
                          }
                        }}

                        className="relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{
                          backgroundColor:
                            user.route_status === "Active" ? "red" : "#D1D5DB",
                          "--tw-ring-color": "red",
                        }}
                      >
                        <span className="sr-only">Toggle route status</span>
                        <span
                          className={`transform transition ease-in-out duration-200 ${user.route_status === "Active" ? "translate-x-5" : "translate-x-1"
                            } inline-block h-4 w-4 rounded-full bg-white`}
                        />
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>


                  <td className="px-4 py-2">
                    {user.route_id ? (
                      <button
                        onClick={() => handleRemoveRoute(user)} // You’ll define this
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove Route
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Assign Route
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>



      {/* Modal for Assign Route */}
      {selectedUser && (
        <AssignRoute
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onAssign={(updatedRoute) => {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 365);
            setUsers((prevUsers) =>
              prevUsers.map((u) =>
                u.id === selectedUser.id
                  ? {
                    ...u,
                    route_id: updatedRoute.route_id,
                    route_status: updatedRoute.route_status,
                    expiry_date: expiryDate.toISOString(),
                  }
                  : u
              )
            );
            setSelectedUser(null);
          }}
        />


      )}

      {viewingUser && (
        <UserInfo
          user={viewingUser}
          onClose={() => setViewingUser(null)}
          setUsers={setUsers}
        />
      )}


    </div>


  );
};

export default UserList;
