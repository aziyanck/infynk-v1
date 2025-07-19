import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import AssignRoute from "./AssignRoute";
import { removeRouteFromUser } from "../../services/adminService"

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // 👈 Track selected user


  const handleRemoveRoute = async (userId) => {
    try {
      await removeRouteFromUser(userId.id);
      alert("Route removed successfully!");
      // optionally re-fetch your user list or update UI here
    } catch (error) {
      console.error(error);
      alert("Failed to remove route: " + error.message);
    }
  };



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

  return (
    <div className="p-6 bg-white shadow-md rounded-lg relative">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Sl. No</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Joined</th>
                <th className="px-4 py-2 text-left">Route ID</th>
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
                    <td className="px-4 py-2">{user.name || "—"}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      {new Date(user.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">{user.route_id || "—"}</td>
                    <td className="px-4 py-2">
                      {user.route_id ? user.route_status : "—"}
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
      )}

      {/* Modal for Assign Route */}
      {selectedUser && (
        <AssignRoute user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default UserList;
