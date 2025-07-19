// src/components/AssignRoute.jsx
import React, { useState } from "react";
import { assignRouteToUser } from "../../services/adminService";

const AssignRoute = ({ user, onClose, onAssign }) => {
  const [routeId, setRouteId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");




  const handleAssign = async () => {
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
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignRoute;
