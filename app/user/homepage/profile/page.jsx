"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Ambil user dari localStorage saat pertama kali load
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      setUsername(parsed.username);
      setEmail(parsed.email);
    }
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/users/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, email }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    // Update localStorage agar navbar ikut berubah
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);

    // 🔥 Tambahkan event untuk refresh navbar
    window.dispatchEvent(new Event("user-updated"));

    alert("Profile berhasil diperbarui!");
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
        <p className="text-gray-500 text-sm">Manage your account information</p>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 shadow flex gap-6 items-center">
        <div className="w-24 h-24 bg-gray-300 rounded-full" />
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800">{user.username}</h2>
          <p className="text-gray-500 text-sm mt-2">
            Member since <span className="font-semibold">2024</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">

        <div>
          <label className="text-gray-700 font-semibold text-sm">Full Name</label>
          <input
            className="w-full mt-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="text-gray-700 font-semibold text-sm">Email</label>
          <input
            className="w-full mt-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button onClick={handleSave} className="bg-teal-500 text-white w-full mt-4">
          Save Changes
        </Button>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-4">
        <h3 className="text-red-600 font-semibold mb-2">Danger Zone</h3>
        <p className="text-gray-600 text-sm mb-4">
          Deleting your account will remove all your saved books and reading history.
        </p>
        <Button className="bg-red-600 text-white w-full">Delete Account</Button>
      </div>
    </div>
  );
}
