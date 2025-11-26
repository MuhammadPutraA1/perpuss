"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          role: "user",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Gagal mendaftar");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch (error) {
      console.log(error);
      setErrorMsg("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{ backgroundImage: "url('/assets/library.jpeg')" }}
      />
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 bg-white shadow-2xl rounded-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">

        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-3xl font-bold text-teal-500 mb-6 text-center">
            Daftar
          </h1>

          {errorMsg && (
            <p className="text-red-600 text-center font-medium">{errorMsg}</p>
          )}

          <form className="space-y-5" onSubmit={handleRegister}>

            <div>
              <label className="block text-teal-700 font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Masukkan Username"
                className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-black"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-teal-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Masukkan Email"
                className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-teal-700 font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Masukkan Kata Sandi"
                className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="destructive"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Loading..." : "Daftar"}
            </Button>

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
            <h2 className="text-white text-2xl font-semibold">
              Selamat Datang Di KaguLib
            </h2>
          </div>
        </div>

      </div>
    </div>
  );
}
