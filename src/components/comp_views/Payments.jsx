import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { Loader2, Search, RefreshCw } from "lucide-react";

const Payments = ({
  payments: initialPayments = [],
  loading: parentLoading,
  onRefresh,
}) => {
  const [payments, setPayments] = useState(initialPayments);

  useEffect(() => {
    setPayments(initialPayments);
  }, [initialPayments]);

  // Use parent loading
  const loading = parentLoading;

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPayments, setSelectedPayments] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredPayments = payments.filter((payment) => {
    const term = searchTerm.toLowerCase();
    const paymentDate = new Date(payment.created_at);

    // Date Filter Logic
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Adjust end date to include the full day
    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    const matchesSearch =
      payment.full_name?.toLowerCase().includes(term) ||
      payment.email?.toLowerCase().includes(term) ||
      payment.razorpay_payment_id?.toLowerCase().includes(term) ||
      payment.razorpay_order_id?.toLowerCase().includes(term);

    const matchesDate =
      (!start || paymentDate >= start) && (!end || paymentDate <= end);

    return matchesSearch && matchesDate;
  });

  // Bulk Selection Logic
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(filteredPayments.map((p) => p.id));
      setSelectedPayments(allIds);
    } else {
      setSelectedPayments(new Set());
    }
  };

  const handleSelectOne = (id) => {
    const newSelected = new Set(selectedPayments);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPayments(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedPayments.size} payment(s)?`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch(
        "https://yowckahgoxqfikadirov.supabase.co/functions/v1/delete-payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ ids: Array.from(selectedPayments) }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to delete payments");
      }

      alert("Payments deleted successfully");
      setSelectedPayments(new Set()); // Clear selection
      if (onRefresh) onRefresh(); // Refresh list
    } catch (error) {
      console.error("Error deleting payments:", error);
      alert(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

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
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Payments</h1>
          {selectedPayments.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete Selected"
              )}
              <span className="bg-red-200 px-1.5 rounded-full text-xs">
                {selectedPayments.size}
              </span>
            </button>
          )}
        </div>

        {/* ... (Search and Date filters remain same) */}
        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
          {/* Date Filters */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Start Date"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="End Date"
            />
          </div>

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
            onClick={onRefresh}
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
                <th className="px-6 py-3 bg-gray-50 w-4">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      filteredPayments.length > 0 &&
                      selectedPayments.size === filteredPayments.length
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
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
                    colSpan="6"
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
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No payments found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className={`border-b transition-colors ${
                      selectedPayments.has(payment.id)
                        ? "bg-blue-50 hover:bg-blue-100"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPayments.has(payment.id)}
                        onChange={() => handleSelectOne(payment.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
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
        <span className="mr-4">{selectedPayments.size} selected</span>
        Total Records: {filteredPayments.length}
      </div>
    </div>
  );
};

export default Payments;
