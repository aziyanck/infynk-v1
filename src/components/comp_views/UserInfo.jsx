import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import QRCode from "qrcode";
import AssignRoute from "./AssignRoute";
import QrDisplay from "./QrDisplay"; // <-- New component
import { removeRouteFromUser } from "../../services/adminService";

const UserInfo = ({ user, onClose, setUsers }) => {
    const [currentUser, setCurrentUser] = useState(user);
    const [selectedUser, setSelectedUser] = useState(null);
    const [qrCodeUrl, setQrCodeUrl] = useState(null); // <-- Store QR code

    useEffect(() => {
        setCurrentUser(user);
    }, [user]);

    const toggleStatus = async () => {
        const newStatus = currentUser.route_status === "Active" ? "Inactive" : "Active";
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
                        route_id: currentUser.route_id,
                        is_active: newStatus === "Active",
                    }),
                }
            );

            const result = await res.json();
            if (res.ok) {
                setUsers(prevUsers =>
                    prevUsers.map(u =>
                        u.id === currentUser.id ? { ...u, route_status: newStatus } : u
                    )
                );
                setCurrentUser(prev => ({ ...prev, route_status: newStatus }));
            } else {
                alert(result.error || "Failed to toggle route status");
            }
        } catch (err) {
            console.error(err);
            alert("Error toggling route status");
        }
    };




    const generateQr = async (routeId) => {
        const urlToEncode = `https://pixic-xi.vercel.app/${routeId}`;
        try {
            const qrDataUrl = await QRCode.toDataURL(urlToEncode); // Base64 QR code
            setQrCodeUrl(qrDataUrl); // Open QrDisplay component
        } catch (err) {
            console.error('Error generating QR code:', err);
        }
    };

    const handleRemoveRoute = async (user) => {
        try {
            await removeRouteFromUser(user.id);
            alert("Route removed successfully!");
            setUsers(prevUsers =>
                prevUsers.map(u =>
                    u.id === user.id
                        ? { ...u, route_id: null, route_status: null, expiry_date: null }
                        : u
                )
            );
            setCurrentUser(prev => ({
                ...prev,
                route_id: null,
                route_status: null,
                expiry_date: null,
            }));
        } catch (error) {
            console.error(error);
            alert("Failed to remove route: " + error.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg md:max-w-md w-full max-w-sm flex flex-col gap-2">
                <div className="flex justify-between p-4 rounded-xl bg-gray-200">
                    <div>
                        <h1 className="text-xl font-semibold"><strong>{currentUser.name}</strong></h1>
                        <p>{currentUser.email}</p>
                    </div>
                    <div className="h-full flex flex-col ">
                        <p>
                            <strong className="hidden md:inline">Joined:</strong>{" "}
                            {currentUser.created_at
                                ? new Date(currentUser.created_at).toLocaleDateString()
                                : "—"}
                        </p>
                    </div>
                </div>

                <div className="flex justify-between p-4 rounded-xl bg-gray-200">
                    <p><strong>Route ID:</strong> {currentUser.route_id || "—"}</p>
                    <p><strong>Expiry:</strong> {currentUser.expiry_date ? new Date(currentUser.expiry_date).toLocaleDateString() : "—"}</p>
                </div>

                <div className="flex justify-between p-4 rounded-xl bg-gray-200">
                    <p><strong>Status</strong></p>
                    {currentUser.route_id ? (
                        <button
                            onClick={toggleStatus}
                            className="relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                            style={{
                                backgroundColor:
                                    currentUser.route_status === "Active" ? "red" : "#D1D5DB",
                                "--tw-ring-color": "red",
                            }}
                        >
                            <span className="sr-only">Toggle route status</span>
                            <span
                                className={`transform transition ease-in-out duration-200 ${currentUser.route_status === "Active" ? "translate-x-5" : "translate-x-1"
                                    } inline-block h-4 w-4 rounded-full bg-white`}
                            />
                        </button>
                    ) : (
                        "—"
                    )}
                </div>

                <div className="flex justify-between p-4 rounded-xl bg-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Close
                    </button>

                    {currentUser.route_id ? (
                        <button
                            onClick={() => generateQr(currentUser.route_id)}
                            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
                        >
                            Get QR
                        </button>
                    ) : (
                        <></>
                    )}




                    {currentUser.route_id ? (
                        <button
                            onClick={() => handleRemoveRoute(currentUser)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Remove Route
                        </button>
                    ) : (
                        <button
                            onClick={() => setSelectedUser(currentUser)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Assign Route
                        </button>
                    )}
                </div>
            </div>

            {selectedUser && (
                <AssignRoute
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onAssign={(updatedRoute) => {
                        const expiryDate = new Date();
                        expiryDate.setDate(expiryDate.getDate() + 365);
                        setUsers(prevUsers =>
                            prevUsers.map(u =>
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
                        setCurrentUser(prev => ({
                            ...prev,
                            route_id: updatedRoute.route_id,
                            route_status: updatedRoute.route_status,
                            expiry_date: expiryDate.toISOString(),
                        }));
                        setSelectedUser(null);
                    }}
                />
            )}

            {qrCodeUrl && (
                <QrDisplay qrCodeUrl={qrCodeUrl} onClose={() => setQrCodeUrl(null)} />
            )}
        </div>
    );
};

export default UserInfo;
