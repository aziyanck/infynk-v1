import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Loader2, CheckCircle, XCircle, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = ({ status, userData }) => {
  const containerRef = useRef();
  const contentRef = useRef();
  const navigate = useNavigate();

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      }).from(contentRef.current, {
        scale: 0.8,
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "back.out(1.7)",
      });
    },
    { scope: containerRef }
  );

  const handleWhatsAppRedirect = () => {
    const { name, email, paymentId } = userData || {};
    const phoneNumber = "9188802136";
    const message = `Hi I'm ${name || "User"}, I purchased card. ${
      email ? `My email is ${email}.` : ""
    } Let's design the card. ${paymentId ? `Payment ID: ${paymentId}` : ""}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
    >
      {/* Grid Background Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-between px-6 md:px-12 opacity-10">
        <div className="w-px h-full bg-white/20"></div>
        <div className="w-px h-full bg-white/20 hidden md:block"></div>
        <div className="w-px h-full bg-white/20 hidden md:block"></div>
        <div className="w-px h-full bg-white/20"></div>
      </div>

      <div
        ref={contentRef}
        className="relative z-10 max-w-md w-full mx-4 p-8 border border-white/10 bg-black/50 backdrop-blur-md rounded-2xl text-center"
      >
        {status === "verifying" && (
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/20 blur-xl rounded-full"></div>
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-tighter text-white mb-2">
                Verifying
              </h2>
              <p className="text-gray-400 font-light">
                Please wait while we secure your payment...
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
              <CheckCircle className="w-16 h-16 text-green-500 relative z-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-tighter text-white mb-2">
                Payment Verified
              </h2>
              <p className="text-gray-400 font-light">
                Your registration has been completed successfully.
              </p>

              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10 mb-2">
                <p className="text-sm text-gray-300 font-light mb-4">
                  Please contact us to finalize your custom card design.
                </p>
                <button
                  onClick={handleWhatsAppRedirect}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold uppercase tracking-widest hover:bg-[#128C7E] transition-all duration-300 rounded-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  Design My Card
                </button>
              </div>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
              <XCircle className="w-16 h-16 text-red-500 relative z-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-tighter text-white mb-2">
                Verification Failed
              </h2>
              <p className="text-gray-400 font-light">
                We couldn't verify your payment. Please contact support.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-8 py-3 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        )}
        {status === "payment_success_user_failed" && (
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"></div>
              <MessageCircle className="w-16 h-16 text-orange-500 relative z-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-tighter text-white mb-2">
                Action Required
              </h2>
              <p className="text-gray-400 font-light mb-4">
                Payment received, but we encountered a technical error setting
                up your account.
              </p>

              <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <p className="text-sm text-orange-200 font-light mb-0">
                  Please contact support immediately to finalize your account.
                  Your payment is safe.
                </p>
              </div>

              <button
                onClick={handleWhatsAppRedirect}
                className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold uppercase tracking-widest hover:bg-[#128C7E] transition-all duration-300 rounded-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
