import React, { useState, Fragment } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { CreditCard, User, Mail, MapPin, Building2, ChevronsUpDown, Check, Calendar } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';

// Options for our dropdowns
const accountTypes = [
    { name: 'Company' },
    { name: 'Personal' },
];

// --- NEW: Subscription plan options ---
const subscriptionPlans = [
    { id: 1, name: '1 Year Subscription', price: 999 },
    { id: 2, name: '2 Year Subscription', price: 1229 },
    { id: 3, name: '3 Year Subscription', price: 1399 },
];

const GetInfo = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState();
    const [address, setAddress] = useState('');
    const [selectedAccountType, setSelectedAccountType] = useState(accountTypes[0]); 
    const [companyName, setCompanyName] = useState('');
    // --- NEW: State for selected subscription plan ---
    const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[0]);

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
        const res = await loadRazorpay('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        const options = {
            key: 'YOUR_KEY_ID',
            // --- UPDATED: Amount is now dynamic based on selected plan ---
            // Razorpay expects the amount in the smallest currency unit (e.g., paise for INR)
            amount: `${selectedPlan.price * 100}`,
            currency: 'INR',
            name: 'Your Company Name',
            description: `Payment for ${selectedPlan.name}`,
            image: 'https://example.com/your_logo.jpg',
            handler: function (response) {
                alert('Payment Successful!');
                console.log('Payment ID:', response.razorpay_payment_id);
                console.log('Order ID:', response.razorpay_order_id);
                console.log('Signature:', response.razorpay_signature);
            },
            prefill: {
                name: fullName,
                email: email,
                contact: phoneNumber,
            },
            notes: {
                address: address,
                company: companyName,
                accountType: selectedAccountType.name,
                // --- NEW: Pass subscription plan info ---
                subscription: selectedPlan.name,
            },
            theme: {
                color: '#6366f1',
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handlePayment();
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black w-screen min-h-screen flex items-center justify-center p-4">
            <style>{`
                .input-field { background-color: rgb(17 24 39); border: 1px solid rgb(55 65 81); border-radius: 0.5rem; color: white; padding: 0.625rem 0.75rem; padding-left: 2.5rem; width: 100%; font-size: 0.875rem; transition: all 0.2s; }
                .input-field:focus { outline: none; border-color: #818cf8; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
                .input-field::placeholder { color: rgb(107 114 128); }
                .textarea-field { background-color: rgb(17 24 39); border: 1px solid rgb(55 65 81); border-radius: 0.5rem; color: white; padding: 0.625rem 0.75rem; padding-left: 2.5rem; width: 100%; font-size: 0.875rem; transition: all 0.2s; resize: none; }
                .textarea-field:focus { outline: none; border-color: #818cf8; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
                .textarea-field::placeholder { color: rgb(107 114 128); }
                .phone-input-custom { display: flex; }
                .phone-input-custom .PhoneInputCountry { background-color: rgb(17 24 39); border: 1px solid rgb(55 65 81); border-right: none; border-radius: 0.5rem 0 0 0.5rem; padding: 0 0.75rem; display: flex; align-items: center; }
                .phone-input-custom .PhoneInputInput { background-color: rgb(17 24 39); border: 1px solid rgb(55 65 81); border-radius: 0 0.5rem 0.5rem 0; color: white; padding: 0.625rem 0.75rem; width: 100%; font-size: 0.875rem; transition: all 0.2s; }
                .phone-input-custom .PhoneInputInput:focus { outline: none; border-color: #818cf8; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
                .phone-input-custom .PhoneInputInput::placeholder { color: rgb(107 114 128); }
                .animate-in { animation: slideIn 0.3s ease-out; }
                @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
            
            <div className="bg-gray-800/40 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700/50">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600/20 rounded-full mb-4">
                        <CreditCard className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h2 className="text-white text-3xl font-bold mb-2">Payment Information</h2>
                    <p className="text-gray-400 text-sm">Please fill in your details to proceed</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-500" /></div>
                            <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field" placeholder="Enter your name" required />
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                        <PhoneInput id="phoneNumber" placeholder="Enter phone number" value={phoneNumber} onChange={setPhoneNumber} defaultCountry="IN" className="phone-input-custom" required />
                    </div>
                    
                    {/* Email Address */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-500" /></div>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="Enter your email address" required />
                        </div>
                    </div>
                    
                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                        <div className="relative">
                            <div className="absolute top-3 left-0 pl-3 pointer-events-none"><MapPin className="h-5 w-5 text-gray-500" /></div>
                            <textarea id="address" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} className="textarea-field" placeholder="Enter your address" required />
                        </div>
                    </div>
                    
                    {/* Account Type Dropdown */}
                    <div>
                        <Listbox value={selectedAccountType} onChange={setSelectedAccountType}>
                            <div className="relative">
                                <Listbox.Label className="block text-sm font-medium text-gray-300 mb-2">Account Type</Listbox.Label>
                                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-900 py-2.5 pl-3 pr-10 text-left border border-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent transition-all text-sm">
                                    <span className="block truncate text-white">{selectedAccountType.name}</span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"><ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" /></span>
                                </Listbox.Button>
                                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10 border border-gray-700">
                                        {accountTypes.map((type, typeIdx) => (
                                            <Listbox.Option key={typeIdx} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-600 text-white' : 'text-gray-300'}`} value={type}>
                                                {({ selected }) => (<>
                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{type.name}</span>
                                                    {selected ? (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-400"><Check className="h-5 w-5" aria-hidden="true" /></span>) : null}
                                                </>)}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>
                    </div>

                    {/* Company Name (Conditional) */}
                    {selectedAccountType.name === 'Company' && (
                        <div className="animate-in">
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Building2 className="h-5 w-5 text-gray-500" /></div>
                                <input type="text" id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="input-field" placeholder="Your Company Inc." required />
                            </div>
                        </div>
                    )}
                    
                    {/* --- NEW: Subscription Plan Dropdown --- */}
                    <div>
                        <Listbox value={selectedPlan} onChange={setSelectedPlan}>
                            <div className="relative">
                                <Listbox.Label className="block text-sm font-medium text-gray-300 mb-2">Subscription Plan</Listbox.Label>
                                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-900 py-2.5 pl-3 pr-10 text-left border border-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent transition-all text-sm">
                                    <span className="block truncate text-white">{selectedPlan.name}</span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"><ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" /></span>
                                </Listbox.Button>
                                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10 border border-gray-700">
                                        {subscriptionPlans.map((plan) => (
                                            <Listbox.Option key={plan.id} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-600 text-white' : 'text-gray-300'}`} value={plan}>
                                                {({ selected }) => (<>
                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{plan.name} - ₹{plan.price}</span>
                                                    {selected ? (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-400"><Check className="h-5 w-5" aria-hidden="true" /></span>) : null}
                                                </>)}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>
                    </div>

                    {/* --- NEW: Display Total Amount --- */}
                    <div className="text-center mt-6 pt-4">
                        <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-4">
                            <p className="text-gray-400 text-sm font-medium">TOTAL AMOUNT</p>
                            <p className="text-white text-3xl font-bold mt-1">₹{selectedPlan.price}</p>
                        </div>
                    </div>

                    <button type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-all duration-200 mt-6 shadow-lg hover:shadow-indigo-500/50">
                        <CreditCard className="w-5 h-5" />
                        Proceed to Payment
                    </button>

                    <p className="text-center text-xs text-gray-500 pt-2">
                        Secure payment powered by Razorpay
                    </p>
                </form>
            </div>
        </div>
    );
};

export default GetInfo;