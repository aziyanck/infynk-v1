import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { Loader2, Search, RefreshCw } from "lucide-react";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch(
        "https://yowckahgoxqfikadirov.supabase.co/functions/v1/list-payments",
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setPayments(data.payments || []);
      } else {
        throw new Error(data.error || "Failed to fetch payments");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      alert("Failed to fetch payments: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const term = searchTerm.toLowerCase();
    return (
      payment.full_name?.toLowerCase().includes(term) ||
      payment.email?.toLowerCase().includes(term) ||
      payment.razorpay_payment_id?.toLowerCase().includes(term) ||
      payment.razorpay_order_id?.toLowerCase().includes(term)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
        <h1 className="text-xl font-semibold">Payments</h1>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={fetchPayments}
            className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="overflow-auto h-full">
          <table className="w-full text-sm text-left relative">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 bg-gray-50">Date</th>
                <th className="px-6 py-3 bg-gray-50">User Details</th>
                <th className="px-6 py-3 bg-gray-50">Plan Info</th>
                <th className="px-6 py-3 bg-gray-50">Payment ID</th>
                <th className="px-6 py-3 bg-gray-50">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-enter text-gray-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading payments...
                    </div>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No payments found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="bg-white border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {formatDate(payment.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {payment.full_name || "Unknown"}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {payment.email}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {payment.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{payment.plan}</div>
                      {payment.company_name && (
                        <div className="text-gray-500 text-xs">
                          {payment.company_name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">
                      <div>{payment.razorpay_payment_id}</div>
                      <div className="text-gray-400 mt-1">
                        Order: {payment.razorpay_order_id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          payment.payment_status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {payment.payment_status?.toUpperCase() || "UNKNOWN"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-right shrink-0">
        Total Records: {filteredPayments.length}
      </div>
    </div>
  );
};

export default Payments;
