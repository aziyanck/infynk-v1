import React, { useState, Fragment, useEffect, useRef } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { CreditCard, User, Mail, MapPin, Building2, ChevronsUpDown, Check } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';

const accountTypes = [
    { name: 'Company' },
    { name: 'Personal' },
];

const subscriptionPlans = [
    { id: 1, name: '1 Year Subscription', price: 999, buttonId: 'pl_RgtVgAZiqOjgxs' },
    { id: 2, name: '2 Year Subscription', price: 1229, buttonId: 'pl_RgtmmcrrigtC7c' },
    { id: 3, name: '3 Year Subscription', price: 1399, buttonId: 'pl_Rgtowg1n0g6JGx' },
];

const GetInfo = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState();
    const [address, setAddress] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [selectedAccountType, setSelectedAccountType] = useState(accountTypes[0]);
    const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[0]);

    const formRef = useRef(null);
    const [isButtonLoaded, setIsButtonLoaded] = useState(false);

    // Inject Razorpay script inside form
    const loadRazorpayButton = () => {
        if (!formRef.current) return;

        formRef.current.innerHTML = ""; // clear previous button

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/payment-button.js";
        script.dataset.payment_button_id = selectedPlan.buttonId;
        script.async = true;

        script.onload = () => {
            setIsButtonLoaded(true);
        };

        formRef.current.appendChild(script);
    };

    // Load on mount + when plan changes
    useEffect(() => {
        setIsButtonLoaded(false);
        loadRazorpayButton();
    }, [selectedPlan]);

    // Do not show page until button loaded
    if (!isButtonLoaded) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
                Loading payment button...
            </div>
        );
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black w-screen min-h-screen flex items-center justify-center p-4">
            <div className="bg-gray-800/40 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700/50">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600/20 rounded-full mb-4">
                        <CreditCard className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h2 className="text-white text-3xl font-bold mb-2">Payment Information</h2>
                    <p className="text-gray-400 text-sm">Please fill in your details</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-5">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute inset-y-0 left-3 h-5 w-5 text-gray-500" />
                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field" required />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                        <PhoneInput value={phoneNumber} onChange={setPhoneNumber} defaultCountry="IN" className="phone-input-custom" required />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute inset-y-0 left-3 h-5 w-5 text-gray-500" />
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                        <div className="relative">
                            <MapPin className="absolute top-3 left-3 h-5 w-5 text-gray-500" />
                            <textarea rows={3} value={address} onChange={(e) => setAddress(e.target.value)} className="textarea-field" required />
                        </div>
                    </div>

                    {/* Account Type */}
                    <Listbox value={selectedAccountType} onChange={setSelectedAccountType}>
                        <div className="relative">
                            <Listbox.Label className="block text-sm font-medium text-gray-300 mb-2">Account Type</Listbox.Label>
                            <Listbox.Button className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-3 pr-10 text-left text-white">
                                {selectedAccountType.name}
                            </Listbox.Button>
                            <Transition as={Fragment}>
                                <Listbox.Options className="absolute w-full bg-gray-900 border border-gray-700 rounded-lg mt-1">
                                    {accountTypes.map((t) => (
                                        <Listbox.Option key={t.name} value={t} className="cursor-pointer p-2 text-gray-300">
                                            {t.name}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>

                    {/* Company Name */}
                    {selectedAccountType.name === "Company" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="input-field" required />
                        </div>
                    )}

                    {/* Plan */}
                    <Listbox value={selectedPlan} onChange={setSelectedPlan}>
                        <div className="relative">
                            <Listbox.Label className="block text-sm font-medium text-gray-300 mb-2">Subscription Plan</Listbox.Label>
                            <Listbox.Button className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-3 pr-10 text-left text-white">
                                {selectedPlan.name}
                            </Listbox.Button>
                            <Transition as={Fragment}>
                                <Listbox.Options className="absolute w-full bg-gray-900 border border-gray-700 rounded-lg mt-1">
                                    {subscriptionPlans.map((plan) => (
                                        <Listbox.Option key={plan.id} value={plan} className="cursor-pointer p-2 text-gray-300">
                                            {plan.name} – ₹{plan.price}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>

                    {/* Total Price */}
                    <div className="text-center mt-4">
                        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                            <p className="text-gray-400 text-sm">TOTAL</p>
                            <p className="text-white text-3xl font-bold">₹{selectedPlan.price}</p>
                        </div>
                    </div>

                    {/* Razorpay Button inside this form */}
                    <div ref={formRef} className="mt-6"></div>

                </form>
            </div>
        </div>
    );
};

export default GetInfo;
