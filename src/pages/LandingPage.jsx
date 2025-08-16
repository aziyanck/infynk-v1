import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'

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
            <section className=" w-screen h-[90vh] flex  items-center justify-center  ">
                <div className=" w-[50vw] h-full">


                </div>

                <div className=" w-[50vw] h-full flex flex-col gap-20 text-start items-center justify-center">

                    <div>
                        <h1 className="text-6xl poppins-black text-white">Pixic</h1>
                        <p className="mt-4 text-5xl poppins-bold">
                            The All <span className="text-blue-400 ">NFC Solutions</span> <br /> You Need!
                        </p>
                    </div>


                    <div class="relative rounded-lg w-40 h-10 overflow-clip bg-gray-300">
                        <div class="absolute top-0 left-0 bg-white flex items-center justify-end box-border text-3xl pr-2 w-full h-full"><FontAwesomeIcon icon={faCaretRight} className="text-gray-800 ml-2" /></div>
                        <div class="absolute top-0 left-0  bg-blue-500 w-[80%] h-full flex justify-center text-white poppins-bold items-center">Order Now!</div>
                    </div>



                </div>

            </section>


        </div>
    );
}
