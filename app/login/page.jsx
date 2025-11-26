"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center blur-sm" style={{ backgroundImage: "url('/assets/library.jpeg')" }} />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 bg-white shadow-2xl rounded-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
            <div className="w-full md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-teal-500 mb-6 text-center">Login</h1>

                    <form className="space-y-5">
                        <div>
                            <label className="block text-teal-700 font-semibold mb-2">Username</label>
                            <input type="password" name="Username" placeholder="Enter Username..." className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black placeholder-gray-400" required />
                        </div>

                        <div>
                            <label className="block text-teal-700 font-semibold mb-2">Password</label>
                            <input type="password" name="password" placeholder="Enter Password..." className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black placeholder-gray-400" required />
                        </div>

                        <Link href={ '/user/homepage' }>
                        <Button variant={ "destructive" }>Login</Button>
                        </Link>

                        <p className="text-center text-sm text-gray-600 mt-4">Dont have Account?{" "}
                        <a href="/register" className="text-teal-600 hover:underline">Register Here</a></p>
                    </form>
                </div>


                <div className="hidden md:block md:w-1/2 relative bg-cover bg-center" style={{ backgroundImage: "url('/assets/libraryy.jpeg')" }}>

                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h2 className="text-white text-2xl font-semibold text-center px-4">Welcome To KaguLib</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}
