import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { supabase } from "../../supabaseClient";
import QRCode from "qrcode";
import AssignRoute from "./AssignRoute";
import QrDisplay from "./QrDisplay";
import { removeRouteFromUser, renewRouteExpiry, deleteUserProfile, deleteAuthUser } from "../../services/adminService";

const UserInfo = ({ user, payments = [], onClose, setUsers }) => {
    const [currentUser, setCurrentUser] = useState(user);
    const [selectedUser, setSelectedUser] = useState(null);
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRemovingRoute, setIsRemovingRoute] = useState(false);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [copiedField, setCopiedField] = useState(null);

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 1500);
        });
    };

    const handleNullifyUser = async () => {
        if (!confirm("Are you sure you want to DELETE this user? This will remove their route, delete their profile, and REMOVE them from Supabase Auth.")) return;

        setIsDeleting(true);

        try {
            // 1. Remove Route
            if (currentUser.route_id) {
                await removeRouteFromUser(currentUser.id);
            }
            // 2. Delete Profile
            await deleteUserProfile(currentUser.id);

            // 3. Delete Auth User
            await deleteAuthUser(currentUser.id);

            alert("User deleted successfully!");

            // Remove from list
            setUsers(prevUsers => prevUsers.filter(u => u.id !== currentUser.id));

            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to delete user: " + error.message);
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        console.log("UserInfo received user:", user);
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
        const urlToEncode = `https://pixiic.com/${routeId}`;
        try {
            const qrDataUrl = await QRCode.toDataURL(urlToEncode); // Base64 QR code
            setQrCodeUrl(qrDataUrl); // Open QrDisplay component
        } catch (err) {
            console.error('Error generating QR code:', err);
        }
    };

    const handleRemoveRoute = async (user) => {
        if (!confirm("Are you sure you want to remove the route?")) return;
        setIsRemovingRoute(true);
        try {
            await removeRouteFromUser(user.id);
            alert("Route removed successfully!");
            setUsers(prevUsers =>
                prevUsers.map(u =>
                    u.id === user.id
                        ? { ...u, route_id: null, route_status: null, expiry_date: null, activation_date: null }
                        : u
                )
            );
            setCurrentUser(prev => ({
                ...prev,
                route_id: null,
                route_status: null,
                expiry_date: null,
                activation_date: null,
            }));
        } catch (error) {
            console.error(error);
            alert("Failed to remove route: " + error.message);
        } finally {
            setIsRemovingRoute(false);
        }
    };

    const handleRenew = async () => {
        if (!currentUser.route_id) return;
        if (!confirm("Are you sure you want to renew this route for 1 year?")) return;

        try {
            const result = await renewRouteExpiry(currentUser.route_id);
            if (result.success) {
                alert("Route renewed successfully!");
                const newExpiry = result.new_expiry;

                setUsers(prevUsers =>
                    prevUsers.map(u =>
                        u.id === currentUser.id ? { ...u, expiry_date: newExpiry } : u
                    )
                );
                setCurrentUser(prev => ({ ...prev, expiry_date: newExpiry }));
            }
        } catch (error) {
            console.error(error);
            alert("Failed to renew route: " + error.message);
        }
    };

    const userPayments = payments.filter(p => p.email === currentUser.email);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg md:max-w-md w-full max-w-sm flex flex-col gap-2">
                <div className="flex justify-between p-4 rounded-xl bg-gray-200">
                    <div>
                        <h1 className="text-xl font-semibold"><strong>{currentUser.name}</strong></h1>
                        <div className="flex items-center gap-1.5">
                            <p>{currentUser.email}</p>
                            <button
                                onClick={() => copyToClipboard(currentUser.email, 'email')}
                                className="transition-colors"
                                title="Copy email"
                            >
                                {copiedField === 'email' ? (
                                    <Check size={14} className="text-green-500" />
                                ) : (
                                    <Copy size={14} className="text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                        <div className="text-right">
                            <p>
                                <strong className="hidden md:inline">Joined:</strong>{" "}
                                {currentUser.created_at
                                    ? new Date(currentUser.created_at).toLocaleDateString()
                                    : "—"}
                            </p>
                        </div>
                        {userPayments.length > 0 && (
                            <button
                                onClick={() => setShowOrderDetails(!showOrderDetails)}
                                className="text-gray-500 hover:text-gray-700 transition-colors mt-2"
                            >
                                {showOrderDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                        )}
                    </div>
                </div>

                {showOrderDetails && userPayments.length > 0 && (
                    <div className="bg-white border rounded-xl p-4 space-y-3">
                        {userPayments.map((payment) => (
                            <div key={payment.id} className="space-y-2 text-sm">
                                <div className="flex justify-between items-start">
                                    <span className="text-gray-500">Address:</span>
                                    <div className="flex items-start gap-1.5">
                                        <span className="text-gray-900 text-right max-w-[200px]">{payment.address || "N/A"}</span>
                                        {payment.address && (
                                            <button
                                                onClick={() => copyToClipboard(payment.address, 'address')}
                                                className="shrink-0 mt-0.5 transition-colors"
                                                title="Copy address"
                                            >
                                                {copiedField === 'address' ? (
                                                    <Check size={14} className="text-green-500" />
                                                ) : (
                                                    <Copy size={14} className="text-gray-400 hover:text-gray-600" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Card Type:</span>
                                    <span className="text-gray-900">{payment.card_type || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Plan:</span>
                                    <span className="text-gray-900">{payment.plan?.replace("_", " ").toUpperCase() || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Qty:</span>
                                    <span className="text-gray-900">{payment.qty || 1}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Amount:</span>
                                    <span className="text-gray-900 font-semibold">₹{(payment.amount || 0)?.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Account:</span>
                                    <span className="text-gray-900">{payment.account_type || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Date:</span>
                                    <span className="text-gray-900">
                                        {payment.created_at
                                            ? new Date(payment.created_at).toLocaleDateString("en-IN", {
                                                day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                                              })
                                            : "N/A"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-col gap-2 p-4 rounded-xl bg-gray-200">
                    <p><strong>Route ID:</strong> {currentUser.route_id || "—"}</p>
                    <div className="flex justify-between items-center">
                        <p>
                            <strong className="hidden md:inline">Activated:</strong>{" "}
                            {currentUser.activation_date
                                ? new Date(currentUser.activation_date).toLocaleDateString()
                                : "—"}
                        </p>
                        <div className="flex items-center gap-2">
                            <p><strong>Expiry:</strong> {currentUser.expiry_date ? new Date(currentUser.expiry_date).toLocaleDateString() : "—"}</p>
                            {currentUser.route_id && (
                                <button
                                    onClick={handleRenew}
                                    className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                                    title="Renew for 1 year"
                                >
                                    +1 Year
                                </button>
                            )}
                        </div>
                    </div>
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

                <div className="flex flex-col gap-3 p-4 rounded-xl bg-gray-200">
                    <div className="flex justify-between w-full">
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
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
                                disabled={isRemovingRoute}
                            >
                                {isRemovingRoute ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Removing
                                    </>
                                ) : (
                                    "Remove Route"
                                )}
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

                    <button
                        onClick={handleNullifyUser}
                        className={`w-full px-3 py-2 bg-red-700 text-white rounded hover:bg-red-800 mt-1 font-semibold flex justify-center items-center gap-2 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Delete Profile and Remove Route"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Deleting...
                            </>
                        ) : (
                            "Delete User"
                        )}
                    </button>
                </div>
            </div>

            {selectedUser && (
                <AssignRoute
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onAssign={(updatedRoute) => {
                        const expiryDate = new Date();
                        expiryDate.setDate(expiryDate.getDate() + 365);
                        const activationDate = new Date().toISOString();
                        setUsers(prevUsers =>
                            prevUsers.map(u =>
                                u.id === selectedUser.id
                                    ? {
                                        ...u,
                                        route_id: updatedRoute.route_id,
                                        route_status: updatedRoute.route_status,
                                        expiry_date: expiryDate.toISOString(),
                                        activation_date: activationDate,
                                    }
                                    : u
                            )
                        );
                        setCurrentUser(prev => ({
                            ...prev,
                            route_id: updatedRoute.route_id,
                            route_status: updatedRoute.route_status,
                            expiry_date: expiryDate.toISOString(),
                            activation_date: activationDate,
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
