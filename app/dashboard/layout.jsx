"use client";
import { useState } from "react";
import AdminSidebar from "@/components/ui/adminsidebar";
import AdminNavbar from "@/components/ui/adminNavbar";

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex w-full min-h-screen">
      <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 flex flex-col bg-gray-100">
        <AdminNavbar setIsOpen={setIsOpen} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
