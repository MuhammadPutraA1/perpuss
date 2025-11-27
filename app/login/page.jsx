"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
  setErrorMsg(data.message || "Login gagal");
  setLoading(false);
  return;
}

// 🔥 Simpan user ke localStorage
localStorage.setItem("user", JSON.stringify(data.user));

// 🔥 Trigger event agar layout update
window.dispatchEvent(new Event("user-updated"));

// redirect berdasarkan role
if (data.user.role === "admin") {
  router.push("/dashboard");
} else {
  router.push("/user/homepage");
}

    } catch (error) {
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
            Login
          </h1>

          {errorMsg && (
            <p className="text-red-600 font-medium text-center mb-2">{errorMsg}</p>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-teal-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                placeholder="Masukkan Email..."
                className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black placeholder-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-teal-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                placeholder="Masukkan Password..."
                className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700">
              {loading ? "Loading..." : "Login"}
            </Button>

            <p className="text-center text-sm text-gray-600 mt-4">
              belum punya akun?{" "}
              <a href="/register" className="text-teal-600 hover:underline">
                Daftar disini!
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
              Selamat datang di KaguLib
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
