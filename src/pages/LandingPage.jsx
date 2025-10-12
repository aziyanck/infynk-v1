import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'

import CubeScene from "./Land/CubeScene";
import CardModel from "./Land/CardModel";
import Services from "./Land/Services";
import '../App.css';


export default function LandingPage() {
    return (
        <div className="bg-black text-white min-h-screen font-sans">

            {/* Navbar */}

            <header className="flex justify-between items-center px-8 py-4 border-b border-gray-700 bg-white/5 backdrop-blur-md sticky top-0 z-50">

                <div className="logo flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-400" />
                    <span className="font-bold">Pixic</span>
                </div>

                <nav className="space-x-8 hidden md:flex">
                    <a href="#services" className="hover:text-blue-400">Services</a>
                    <a href="#products" className="hover:text-blue-400">Products</a>
                    <a href="#about" className="hover:text-blue-400">About</a>
                </nav>

                <button className="border border-gray-500 rounded px-4 py-1 cursor-pointer hover:bg-gray-800">Login</button>
            </header>


            {/* Hero Section */}
            <section className="w-screen h-auto md:h-[90vh] flex flex-col md:flex-row items-center justify-center bg-black px-6 md:px-12 py-10">
                {/* Left side */}
                <div className="w-full md:w-[50vw] h-[40vh] md:h-full flex items-center justify-center">
                    <div className="w-full h-full">
                        <CardModel />
                        
                        
                    </div>
                </div>

                {/* Right side */}
                <div className="w-full md:w-[50vw] h-auto md:h-full flex flex-col gap-10 text-center md:text-start items-center md:items-start justify-center">
                    {/* Title + Subtitle */}
                    <div>
                        <h1 className="text-4xl md:text-6xl poppins-black text-white">Pixic</h1>
                        <p className="mt-4 text-2xl md:text-5xl poppins-bold">
                            The All <span className="text-blue-400">NFC Solutions</span> <br /> You Need!
                        </p>
                    </div>

                    {/* Button */}
                    <div className="relative rounded-lg w-40 h-12 overflow-clip bg-gray-300">
                        <div className="absolute top-0 left-0 bg-white flex items-center justify-end box-border text-2xl md:text-3xl pr-2 w-full h-full">
                            <FontAwesomeIcon icon={faCaretRight} className="text-gray-800 ml-2" />
                        </div>
                        <div className="absolute top-0 left-0 bg-blue-500 w-[80%] h-full flex justify-center text-white poppins-bold items-center">
                            Order Now!
                        </div>
                    </div>
                </div>
            </section>



            <Services />


        </div>
    );
}
