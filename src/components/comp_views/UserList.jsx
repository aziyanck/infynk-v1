// UserList.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import AssignRoute from "./AssignRoute";
import { removeRouteFromUser } from "../../services/adminService"
import UserInfo from "./UserInfo";

const UserList = ({ users, setUsers }) => {

  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // 👈 Track selected user
  const [viewingUser, setViewingUser] = useState(null);


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
      <h2 className="text-2xl font-bold mb-4">All Users</h2>


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
