"use client";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ambil data buku
  useEffect(() => {
    const getBooks = async () => {
      try {
        const res = await fetch("/api/buku?limit=3");
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.log("error fetch buku:", err);
      } finally {
        setLoading(false);
      }
    };
    getBooks();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4 lg:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6">

      {/* header mobile */}
      <div className="lg:hidden flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Kagulib</h1>
      </div>

      {/* konten kiri */}
      <main className="flex-1 bg-white rounded-2xl shadow p-4 lg:p-6">

        {/* bagian search & menu */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">

          <div className="flex items-center gap-6 font-semibold text-gray-600">
            <button className="text-black border-b-2 border-teal-500 pb-1">
              Recommended
            </button>

            <Link
              href="/user/homepage/booklist"
              className="text-sm text-teal-600 hover:underline font-medium"
            >
              See All
            </Link>
          </div>

          {/* 🔹 Desktop header kanan */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl gap-2 w-full lg:w-[270px]">
              <Search size={18} className="text-gray-500" />
              <input
                className="bg-transparent outline-none text-sm w-full"
                placeholder="Search for title, author, tags, etc"
              />
            </div>
          </div>
        </div>

        {/* list buku */}
        {loading ? (
          <p>Loading books...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.slice(0, 3).map((book) => (
              <Card
                key={book.id_buku}
                className="shadow overflow-hidden object-cover cursor-pointer hover:scale-[1.02] transition p-0 border-0"
              >
                <img
                  src={`/buku/coverbuku/${book.gambar}`}
                  alt={book.judul}
                  className="w-full h-100  object-cover"/>

                <CardContent className="p-3">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">
                    {book.judul}
                  </h3>
                  <p className="text-gray-500 text-xs">{book.penulis}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* buku user */}
        <h3 className="mt-8 text-lg font-semibold text-gray-700">Your Books</h3>

        <div className="mt-4 flex flex-col gap-4">
          <Card className="p-4 flex justify-between items-center border-2 border-dashed text-gray-400">
            <p>No books borrowed yet</p>
            <Button>See All</Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
