import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6">
      <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-10 max-w-lg w-full text-center shadow-xl animate-fade-in">
        
        <div className="flex justify-center mb-6">
          <div className="bg-green-600/20 rounded-full p-5">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
        </div>

        <h1 className="text-white text-3xl font-bold">Payment Successful!</h1>
        <p className="text-gray-400 mt-3 text-sm">
          Thank you for your purchase. Your payment has been received successfully.
        </p>

        <div className="mt-6 bg-gray-900/60 border border-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Transaction Status</p>
          <p className="text-white text-xl font-semibold mt-1">✓ Completed</p>
        </div>

        <button 
          onClick={() => window.location.href = "/"}
          className="mt-8 w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-lg hover:shadow-indigo-500/40"
        >
          Go to Home
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}
