"use client";

import Link from "next/link";
import { Search, Bell } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Layout({ children }) {
  const pathname = usePathname();

  const menu = [
    { name: "Discover", path: "/user/homepage" },
    { name: "Category", path: "/user/homepage/category" },
    { name: "Book List", path: "/user/homepage/booklist" },
    { name: "Favorite", path: "/user/homepage/favorite" },
    { name: "Settings", path: "/user/homepage/settings" },
  ];

  return (
    <div className="w-full h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white h-full shadow-lg p-6 flex flex-col">
        <nav className="flex flex-col gap-2 text-gray-700 font-medium">
          {menu.map((item) => {
            const active = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`px-3 py-2 rounded-lg transition  ${active ? "bg-teal-500 text-white font-semibold" : "hover:bg-gray-100"}`}>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">

        <div className="w-full bg-white shadow py-4 px-12 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl w-96">
            <Search className="w-5 h-5 text-gray-500" />
            <input type="text" placeholder="Search a books" className="bg-transparent outline-none flex-1"/>
          </div>

          <div className="flex items-center gap-8">
            <Link href="/user/homepage/profile" className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex flex-col">
                <h2 className="text-sm font-semibold">Vynns</h2>
              </div>
            </Link>
          </div>
        </div>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
