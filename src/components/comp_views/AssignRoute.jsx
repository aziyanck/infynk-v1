// src/components/AssignRoute.jsx
import React, { useState } from "react";
import { assignRouteToUser } from "../../services/adminService";

const AssignRoute = ({ user, onClose, onAssign }) => {
  const [routeId, setRouteId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");




  const handleAssign = async () => {
    if (!routeId) return;
    setLoading(true);
    try {
      // Make the Edge Function call or insert route logic
      const response = await assignRouteToUser(user.id, routeId); // however you’re assigning

      if (response.success) {
        // 🟢 Trigger parent update
        onAssign({
          route_id: routeId,
          route_status: "Active", // or dynamic value from response
        });
      } else {
        alert("Assignment failed");
      }
    } catch (error) {
      console.error("Error assigning route:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md m-6 relative">
        <h3 className="text-xl font-semibold mb-4">Assign Route</h3>
        <p className="mb-2"><strong>User:</strong> {user.email}</p>
        <p className="mb-4"><strong>Name:</strong> {user.name || "—"}</p>

        <label className="block mb-2">
          Route ID:
          <input
            type="text"
            placeholder="Enter Route ID"
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAssign();
            }}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2 min-w-[100px]"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Assigning...
              </>
            ) : (
              "Assign"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignRoute;
