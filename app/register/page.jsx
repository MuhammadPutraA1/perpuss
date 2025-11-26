"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center blur-sm" style={{ backgroundImage: "url('/assets/library.jpeg')" }} />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 bg-white shadow-2xl rounded-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
                <div className="w-full md:w-1/2 p-8">
                    <h1 className="text-3xl font-bold text-teal-500 mb-6 text-center">Daftar</h1>

                    <form className="space-y-5">
                        <div>
                            <label className="block text-teal-700 font-semibold mb-2">Username</label>
                            <input type="password" name="Username" placeholder="Masukkan Username" className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-black placeholder-gray-400" required />
                        </div>

                        <div>
                            <label className="block text-teal-700 font-semibold mb-2">Email</label>
                            <input type="Email" name="Email" placeholder="Masukkan email" className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-black placeholder-gray-400" required />
                        </div>

                        <div>
                            <label className="block text-teal-700 font-semibold mb-2">Kata Sandi</label>
                            <input type="password" name="password" placeholder="Masukkan kata sandi" className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-black placeholder-gray-400" required />
                        </div>

                        <Button variant={ "destructive" }>Masuk</Button>

                        <p className="text-center text-sm text-gray-600 mt-4">
                            Sudah punya akun?{" "}
                            <a href="/login" className="text-teal-600 hover:underline">
                                Masuk di sini
                            </a>
                        </p>
                    </form>
                </div>


                <div
                    className="hidden md:block md:w-1/2 relative bg-cover bg-center"
                    style={{ backgroundImage: "url('/assets/libraryy.jpeg')" }}
                >

                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h2 className="text-white text-2xl font-semibold text-center px-4">
                            Selamat Datang Di KaguLib
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
}
