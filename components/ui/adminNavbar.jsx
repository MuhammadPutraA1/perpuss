"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Load pertama kali
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));

    // Dengarkan event dari profile
    const updateUser = () => {
      const refreshed = localStorage.getItem("user");
      if (refreshed) setUser(JSON.parse(refreshed));
    };

    window.addEventListener("user-updated", updateUser);
    return () => window.removeEventListener("user-updated", updateUser);
  }, []);

  return (
    <div className="w-full bg-white shadow py-4 px-12 flex items-center justify-end">
      <div
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
        onClick={() => router.push("/dashboard/profile")}
      >
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>

        <div className="flex flex-col">
          <h2 className="text-sm font-semibold">
            {user ? user.username : "Admin"}
          </h2>
        </div>
      </div>
    </div>
  );
}
