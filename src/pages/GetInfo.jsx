import React, { useState, useRef } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  CreditCard,
  User,
  Mail,
  MapPin,
  Building2,
  Loader2,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { supabase } from "../supabaseClient";
import PaymentSuccess from "../components/PaymentSuccess";

// ---------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------
const RAZORPAY_KEY_ID = "rzp_test_RvWpRFSJe78xVj";

const PRICING_CONFIG = {
  "PVC Card": {
    plans: {
      "1_year": 1199,
      "2_year": 1399,
      "3_year": 1599,
    },
    single_item: 200,
  },
  "Wooden Card": {
    plans: {
      "1_year": 1299,
      "2_year": 1499,
      "3_year": 1699,
    },
    single_item: 350,
  },
};

const GetInfo = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState();
  const [address, setAddress] = useState("");
  const [accountType, setAccountType] = useState("Company");
  const [companyName, setCompanyName] = useState("");

  const [planDuration, setPlanDuration] = useState("1_year");
  const [cardType, setCardType] = useState("PVC Card");
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle"); // 'idle' | 'verifying' | 'success' | 'failed'
  const [paymentData, setPaymentData] = useState(null); // Stores orderId, paymentId, etc.
  
  const [qty, setQty] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);

  const containerRef = useRef();
  const formRef = useRef();

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(formRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      tl.from(
        ".form-item",
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.5"
      );
    },
    { scope: containerRef }
  );

  React.useEffect(() => {
    const selectedConfig = PRICING_CONFIG[cardType] || PRICING_CONFIG["PVC Card"];
    const planPrice = selectedConfig.plans[planDuration] || 0;
    // First card included in plan, extra cards charged
    const extraQty = Math.max(0, qty - 1);
    const extraCardPrice = selectedConfig.single_item * extraQty;
    
    setTotalAmount(planPrice + extraCardPrice);
  }, [planDuration, qty, cardType]);

  const loadRazorpay = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!fullName || !email || !phoneNumber) {
      alert("Please fill in the required fields (Name, Email, Phone).");
      return;
    }

    setLoading(true);

    try {
      const { data: orderData, error } = await supabase.functions.invoke(
        "create-order",
        {
          body: { planName: planDuration, qty: qty, cardType: cardType },
        }
      );

      if (error) {
        console.error("Edge Function Error:", error);
        throw new Error("Failed to contact server to create order.");
      }

      if (!orderData || !orderData.id) {
        throw new Error("Invalid response from server.");
      }

      const res = await loadRazorpay(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!res) {
        throw new Error("Razorpay SDK failed to load. Check your internet.");
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Pixiic",
        description: planDuration,
        image: "https://example.com/your_logo.jpg",
        order_id: orderData.id,

        handler: async function (response) {
          console.log("Payment Processing...");
          setPaymentStatus("verifying"); // Show verifying screen

          // Store payment data for the success screen
          setPaymentData({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
          });

          try {
            // CALL THE SECURE EDGE FUNCTION
            const { data: verifyData, error: verifyError } =
              await supabase.functions.invoke("verify-payment", {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  userData: {
                    full_name: fullName,
                    email: email,
                    phone: phoneNumber,
                    address: address,
                    account_type: accountType,
                    company_name:
                      accountType === "Company" ? companyName : null,
                    plan: planDuration,
                    card_type: cardType,
                    qty: qty,
                  },
                },
              });

            if (verifyError) throw verifyError;

            // Handle Edge Function Responses
            if (verifyData.success) {
              setPaymentStatus("success");
            } else if (verifyData.paymentVerified && !verifyData.success) {
              console.warn(
                "Payment success, User creation failed:",
                verifyData.message
              );
              setPaymentStatus("payment_success_user_failed");
            } else {
              throw new Error(verifyData.error || "Verification failed");
            }
          } catch (err) {
            console.error("Verification Failed:", err);
            setPaymentStatus("failed"); // Show failed screen
            alert(
              "Payment succeeded, but verification failed. Please contact support."
            );
          }
        },

        prefill: {
          name: fullName,
          email: email,
          contact: phoneNumber,
        },

        notes: {
          user_name: fullName,
          user_plan: planDuration,
          user_address: address,
          user_company: accountType === "Company" ? companyName : "Personal",
          account_type: accountType,
        },

        theme: {
          color: "#2563eb", // blue-600
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", function (response) {
        alert("Payment Failed: " + response.error.description);
        setPaymentStatus("failed");
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong initializing payment.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      handlePayment();
    }
  };

  return (
    <div
      ref={containerRef}
      className="bg-black text-white min-h-screen font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden relative"
    >
      {/* Payment Success Overlay */}
      {paymentStatus !== "idle" && (
        <PaymentSuccess
          status={paymentStatus}
          userData={{
            name: fullName,
            email: email,
            paymentId: paymentData?.paymentId,
          }}
        />
      )}

      <style>{`
                .phone-input-custom .PhoneInputInput {
                    background-color: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 0;
                    color: white;
                    padding: 0.75rem;
                    width: 100%;
                    font-size: 0.875rem;
                    transition: all 0.3s;
                }
                .phone-input-custom .PhoneInputInput:focus {
                    outline: none;
                    border-color: #3b82f6;
                }
                .phone-input-custom .PhoneInputInput::placeholder {
                    color: #9ca3af;
                }
                .phone-input-custom .PhoneInputCountry {
                    background-color: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-right: none;
                    border-radius: 0;
                    margin-right: -1px;
                    padding: 0 0.5rem;
                }
            `}</style>

      {/* Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-between px-6 md:px-12 opacity-20">
        <div className="w-px h-full bg-white/20"></div>
        <div className="w-px h-full bg-white/20 hidden md:block"></div>
        <div className="w-px h-full bg-white/20 hidden md:block"></div>
        <div className="w-px h-full bg-white/20"></div>
      </div>

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 flex justify-between items-center mix-blend-difference">
        <a
          href="/"
          className="text-2xl font-bold tracking-tighter uppercase text-white hover:opacity-80 transition-opacity flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </a>
        <div className="text-xl font-bold tracking-widest uppercase">
          Pixiic
        </div>
      </header>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-24">
        <div ref={formRef} className="w-full max-w-lg">
          <div className="text-center mb-12 form-item">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-4">
              Get Started
            </h2>
            <p className="text-gray-400 font-light text-lg">
              Join the next generation of networking.
            </p>
          </div>

          <div className="space-y-6">
            <div className="form-item">
              <label
                htmlFor="fullName"
                className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full px-4 py-3 bg-transparent border border-white/20 text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 transition-colors"
                placeholder="JOHN DOE"
              />
            </div>

            <div className="form-item">
              <label
                htmlFor="phoneNumber"
                className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2"
              >
                Phone Number
              </label>
              <PhoneInput
                id="phoneNumber"
                placeholder="ENTER PHONE NUMBER"
                value={phoneNumber}
                onChange={setPhoneNumber}
                defaultCountry="IN"
                className="phone-input-custom"
              />
            </div>

            <div className="form-item">
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 bg-transparent border border-white/20 text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 transition-colors"
                placeholder="YOU@EXAMPLE.COM"
              />
            </div>

            <div className="form-item">
              <label
                htmlFor="address"
                className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2"
              >
                Shipping Address
              </label>
              <textarea
                id="address"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="block w-full px-4 py-3 bg-transparent border border-white/20 text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 transition-colors resize-none"
                placeholder="FULL ADDRESS"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 form-item">
              <div className="col-span-2">
                <label
                  htmlFor="cardType"
                  className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2"
                >
                  Card Type
                </label>
                <div className="relative">
                  <select
                    id="cardType"
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value)}
                    className="block w-full px-4 py-3 bg-transparent border border-white/20 text-white focus:outline-none focus:border-blue-600 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="PVC Card" className="bg-black">
                      PVC CARD
                    </option>
                    <option value="Wooden Card" className="bg-black">
                      WOODEN CARD
                    </option>
                    {/* <option value="Metal Card" className="bg-black">
                      METAL CARD
                    </option> */}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label
                  htmlFor="qty"
                  className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2"
                >
                  QTY
                </label>
                <input
                  type="number"
                  id="qty"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="block w-full px-4 py-3 bg-transparent border border-white/20 text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 form-item">
              <div>
                <label
                  htmlFor="accountType"
                  className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2"
                >
                  Account Type
                </label>
                <div className="relative">
                  <select
                    id="accountType"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="block w-full px-4 py-3 bg-transparent border border-white/20 text-white focus:outline-none focus:border-blue-600 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Company" className="bg-black">
                      COMPANY
                    </option>
                    <option value="Personal" className="bg-black">
                      PERSONAL
                    </option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                </div>
              </div>
              <div>
                <label
                  htmlFor="planDuration"
                  className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2"
                >
                  Plan
                </label>
                <div className="relative">
                  <select
                    id="planDuration"
                    value={planDuration}
                    onChange={(e) => setPlanDuration(e.target.value)}
                    className="block w-full px-4 py-3 bg-transparent border border-white/20 text-white focus:outline-none focus:border-blue-600 transition-colors appearance-none cursor-pointer"
                  >
                    {Object.entries(
                      (PRICING_CONFIG[cardType] || PRICING_CONFIG["PVC Card"]).plans
                    ).map(([key, price]) => {
                      const label = key.replace("_", " ").toUpperCase();
                      return (
                        <option key={key} value={key} className="bg-black">
                          {label} - ₹{price}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                </div>
              </div>
            </div>

            {accountType === "Company" && (
              <div className="form-item">
                <label
                  htmlFor="companyName"
                  className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="block w-full px-4 py-3 bg-transparent border border-white/20 text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 transition-colors"
                  placeholder="YOUR COMPANY INC."
                />
              </div>
            )}

            {/* Total Amount Display */}
            <div className="form-item bg-white/5 border border-white/10 p-4 rounded text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                Total Amount
              </p>
              <p className="text-3xl font-bold text-white">
                ₹{totalAmount}
              </p>
              <div className="text-[10px] text-gray-500 mt-1">
                (Plan: ₹
                {
                  (PRICING_CONFIG[cardType] || PRICING_CONFIG["PVC Card"]).plans[
                    planDuration
                  ]
                }{" "}
                + Extra Cards: ₹
                {(PRICING_CONFIG[cardType] || PRICING_CONFIG["PVC Card"])
                  .single_item * Math.max(0, qty - 1)}
                )
              </div>
            </div>

            <button
              onClick={handleFormSubmit}
              disabled={loading}
              className={`w-full mt-8 py-4 px-6 bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                "Proceed to Payment"
              )}
            </button>

            <p className="text-center text-[10px] uppercase tracking-widest text-gray-600 mt-6 form-item">
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetInfo;
