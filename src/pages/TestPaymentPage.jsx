import React, { useState } from "react";
import PaymentSuccess from "../components/PaymentSuccess";

const TestPaymentPage = () => {
  const [status, setStatus] = useState("idle"); // 'idle' | 'verifying' | 'success' | 'failed'

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8 uppercase tracking-widest">
        Payment Success Component Test
      </h1>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-black/80 backdrop-blur-md z-[60] flex justify-center gap-4 border-t border-white/10">
        <button
          onClick={() => setStatus("idle")}
          className={`px-6 py-2 text-sm font-bold uppercase tracking-widest border border-white/20 hover:bg-white hover:text-black transition-all ${
            status === "idle" ? "bg-white text-black" : ""
          }`}
        >
          Idle
        </button>
        <button
          onClick={() => setStatus("verifying")}
          className={`px-6 py-2 text-sm font-bold uppercase tracking-widest border border-blue-500/50 hover:bg-blue-600 hover:text-white transition-all ${
            status === "verifying" ? "bg-blue-600 text-white" : ""
          }`}
        >
          Verifying
        </button>
        <button
          onClick={() => setStatus("success")}
          className={`px-6 py-2 text-sm font-bold uppercase tracking-widest border border-green-500/50 hover:bg-green-600 hover:text-white transition-all ${
            status === "success" ? "bg-green-600 text-white" : ""
          }`}
        >
          Success
        </button>
        <button
          onClick={() => setStatus("failed")}
          className={`px-6 py-2 text-sm font-bold uppercase tracking-widest border border-red-500/50 hover:bg-red-600 hover:text-white transition-all ${
            status === "failed" ? "bg-red-600 text-white" : ""
          }`}
        >
          Failed
        </button>
      </div>

      <p className="mt-8 text-gray-500 max-w-md text-center mb-20">
        Click the buttons above to toggle the Payment Success overlay states.
        The 'idle' state hides the overlay.
      </p>

      {/* Conditionally render the component based on status */}
      {status !== "idle" && (
        <div className="absolute inset-0 z-40">
          <PaymentSuccess status={status} />
          {/* Add a close button for testing purposes since the overlay covers everything */}
          <button
            onClick={() => setStatus("idle")}
            className="fixed top-4 right-4 z-[60] text-white/50 hover:text-white p-2 bg-black/50 rounded-full"
            title="Close Overlay"
          >
            (Close Test View)
          </button>
        </div>
      )}
    </div>
  );
};

export default TestPaymentPage;
