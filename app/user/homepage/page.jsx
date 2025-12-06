"use client";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingFav, setLoadingFav] = useState(true);

  // ambil user + data buku & favorit
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      fetchFavorites(parsed.id_users);
    } else {
      setLoadingFav(false);
    }

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

  const fetchFavorites = async (userId) => {
    try {
      setLoadingFav(true);
      const res = await fetch(`/api/favorit?user=${userId}`);
      if (!res.ok) throw new Error("Gagal memuat favorit");
      const data = await res.json();
      setFavorites(data);
    } catch (err) {
      console.error("error fetch favorit:", err);
      setFavorites([]);
    } finally {
      setLoadingFav(false);
    }
  };

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
              href="/user/homepage/buku"
              className="text-sm text-teal-600 hover:underline font-medium"
            >
              See All
            </Link>
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
        <div className="mt-8 mb-2 flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-700">Your Books</h3>
          <Link
            href="/user/homepage/favorite"
            className="text-sm text-teal-600 hover:underline font-medium"
          >
            See All
          </Link>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {loadingFav ? (
            <Card className="p-4 text-gray-500">Loading your favorites...</Card>
          ) : !user ? (
            <Card className="p-4 flex justify-between items-center border-2 border-dashed text-gray-400">
              <p>Silakan login untuk melihat favorit Anda</p>
            </Card>
          ) : favorites.length === 0 ? (
            <Card className="p-4 flex justify-between items-center border-2 border-dashed text-gray-400">
              <p>Belum ada favorit</p>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.slice(0, 3).map((book) => (
                  <Link key={book.id_buku} href={`/user/homepage/buku/${book.id_buku}`}>
                    <Card className="shadow overflow-hidden hover:scale-[1.02] transition p-0 border">
                      <img
                        src={`/buku/coverbuku/${book.gambar || "default.jpg"}`}
                        alt={book.judul}
                        className="w-full h-48 object-cover"
                      />
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-gray-800 text-sm truncate">
                          {book.judul}
                        </h3>
                        <p className="text-gray-500 text-xs">{book.penulis}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
