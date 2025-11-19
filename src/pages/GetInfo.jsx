import React, { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { CreditCard, User, Mail, MapPin, Building2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client (needed to call the function)
const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

const GetInfo = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState();
  const [address, setAddress] = useState('');
  const [accountType, setAccountType] = useState('Company');
  const [companyName, setCompanyName] = useState('');
  // Ensure this string matches the keys in the Edge Function PRICING object exactly
  const [planDuration, setPlanDuration] = useState('1 Year Plan 999/-');
  const [loading, setLoading] = useState(false);

  const loadRazorpay = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!fullName || !email || !phoneNumber) {
      alert("Please fill in basic details");
      return;
    }

    setLoading(true);

    try {
      // 1. Call Supabase Edge Function to create Order
      const { data: orderData, error } = await supabase.functions.invoke('razorpay-webhook', {
        body: { planName: planDuration }
      });

      if (error || !orderData.id) {
        console.error(error);
        alert('Failed to create order. Check console.');
        setLoading(false);
        return;
      }

      // 2. Load Razorpay SDK
      const res = await loadRazorpay('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        alert('Razorpay SDK failed to load.');
        setLoading(false);
        return;
      }

      // 3. Open Razorpay Options
      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your actual Key ID
        amount: orderData.amount,     // Amount returned from backend (in paise)
        currency: orderData.currency,
        name: 'Your App Name',
        description: planDuration,
        image: 'https://example.com/your_logo.jpg',
        order_id: orderData.id,       // THE CRITICAL PART: Link to the backend order

        // 4. Handler: What happens after success in the UI
        handler: function (response) {
          alert('Payment Successful! Processing your order...');
          console.log('Payment ID:', response.razorpay_payment_id);
          // Optionally redirect user to a "Success" page here
        },
        prefill: {
          name: fullName,
          email: email,
          contact: phoneNumber,
        },
        // 5. NOTES: These are sent to the Webhook to update your database
        notes: {
          user_name: fullName,
          user_plan: planDuration,
          user_address: address,
          user_company: companyName,
          account_type: accountType
        },
        theme: {
          color: '#6366f1',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on('payment.failed', function (response) {
        alert("Payment Failed: " + response.error.description);
      });

    } catch (err) {
      console.error("Payment Setup Error:", err);
      alert("Something went wrong initializing payment.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handlePayment();
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black w-screen min-h-screen flex items-center justify-center p-4">
      <style>{`
                .phone-input-custom .PhoneInputInput {
                    background-color: rgb(17 24 39);
                    border: 1px solid rgb(55 65 81);
                    border-radius: 0.5rem;
                    color: white;
                    padding: 0.625rem 0.75rem;
                    width: 100%;
                    font-size: 0.875rem;
                    transition: all 0.2s;
                }
                .phone-input-custom .PhoneInputInput:focus {
                    outline: none;
                    border-color: #818cf8;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                }
                .phone-input-custom .PhoneInputInput::placeholder {
                    color: rgb(107 114 128);
                }
                .phone-input-custom .PhoneInputCountry {
                    background-color: rgb(17 24 39);
                    border: 1px solid rgb(55 65 81);
                    border-right: none;
                    border-radius: 0.5rem 0 0 0.5rem;
                    margin-right: -1px;
                    padding: 0 0.5rem;
                }
                .animate-in {
                    animation: slideIn 0.3s ease-out;
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>

      <div className="bg-gray-800/40 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700/50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600/20 rounded-full mb-4">
            <CreditCard className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-white text-3xl font-bold mb-2">Payment Information</h2>
          <p className="text-gray-400 text-sm">Please fill in your details to proceed</p>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <PhoneInput
              id="phoneNumber"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={setPhoneNumber}
              defaultCountry="IN"
              className="phone-input-custom"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
              Address
            </label>
            <div className="relative">
              <div className="absolute top-3 left-0 pl-3 pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-500" />
              </div>
              <textarea
                id="address"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm resize-none"
                placeholder="123 Main St, Anytown, USA"
              />
            </div>
          </div>

          <div>
            <label htmlFor="accountType" className="block text-sm font-medium text-gray-300 mb-2">
              Account Type
            </label>
            <select
              id="accountType"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="block w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm cursor-pointer"
            >
              <option>Company</option>
              <option>Personal</option>
            </select>
          </div>

          <div>
            <label htmlFor="planDuration" className="block text-sm font-medium text-gray-300 mb-2">
              Plan Duration
            </label>
            <select
              id="planDuration"
              value={planDuration}
              onChange={(e) => setPlanDuration(e.target.value)}
              className="block w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm cursor-pointer"
            >
              <option>1 Year Plan 999/-</option>
              <option>2 Year Plan 1299/-</option>
              <option>3 Year Plan 1399/-</option>
            </select>
          </div>

          {accountType === 'Company' && (
            <div className="animate-in">
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-2">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  placeholder="Your Company Inc."
                />
              </div>
            </div>
          )}

          <button
            onClick={handleFormSubmit}
            disabled={loading} // Disable while fetching order
            className={`w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 mt-6 shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Preparing Payment...' : (
              <>
                <CreditCard className="w-5 h-5" />
                Proceed to Payment
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            Secure payment powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
};

export default GetInfo;