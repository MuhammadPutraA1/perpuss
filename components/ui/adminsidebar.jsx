"use client";
import { Home, Users, Library, LogOut, Menu } from "lucide-react";
import Link from "next/link";

export default function AdminSidebar({ isOpen, setIsOpen }) {
  return (
    <div
      className={`fixed lg:static top-0 left-0 h-full text-black p-5 w-64 transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-64"} lg:translate-x-0 z-50`}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button className="lg:hidden" onClick={() => setIsOpen(false)}>
          <Menu />
        </button>
      </div>

      <ul className="space-y-3">
        <li>
          <Link href="/dashboard" className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded">
            <Home size={20} /> Dashboard
          </Link>
        </li>
        <li>
          <Link href="/dashboard/peminjaman" className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded">
            <Users size={20} /> Kelola Peminjaman
          </Link>
        </li>
        <li>
          <Link href="/dashboard/buku" className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded">
            <Library size={20} /> Kelola buku
          </Link>
        </li>
         <li>
          <Link href="/dashboard/kelolauser" className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded">
            <Users size={20} /> Kelola user
          </Link>
        </li>
        <li>
            <Link href="/dashboard/settings">
          <button className="flex items-center gap-3 p-2 hover:bg-red-600 rounded mt-5 w-full text-left">
            <LogOut size={20} /> Settings
          </button>
          </Link>
        </li>
      </ul>
    </div>
  );
}
