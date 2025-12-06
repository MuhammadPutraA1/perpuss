"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function FavoritePage() {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil user dari localStorage
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      setLoading(false);
    }

    // Re-fetch ketika user di-update
    const handleUpdate = () => {
      const updated = localStorage.getItem("user");
      if (updated) {
        const parsed = JSON.parse(updated);
        setUser(parsed);
        fetchFavorites(parsed.id_users);
      } else {
        setUser(null);
        setFavorites([]);
      }
    };

    window.addEventListener("user-updated", handleUpdate);
    return () => window.removeEventListener("user-updated", handleUpdate);
  }, []);

  useEffect(() => {
    if (user?.id_users) {
      fetchFavorites(user.id_users);
    }
  }, [user]);

  const fetchFavorites = async (id_users) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/favorit?user=${id_users}`);
      if (!res.ok) throw new Error("Gagal memuat favorit");
      const data = await res.json();
      setFavorites(data);
    } catch (err) {
      console.error(err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const emptyState = loading
    ? "Loading favorites..."
    : !user
    ? "Anda belum login."
    : "You haven't added any favorite books yet.";

  return (
    <div className="w-full h-full flex flex-col gap-8">
      <h1 className="text-xl font-bold text-gray-800 mb-2">Favorite Books</h1>

      {favorites.length === 0 && (
        <div className="text-gray-500 text-sm italic">{emptyState}</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {favorites.map((book) => (
          <Link
            key={book.id_buku}
            href={`/user/homepage/buku/${book.id_buku}`}
          >
            <Card className="rounded-xl overflow-hidden shadow hover:scale-[1.03] transition p-0 cursor-pointer">
              <CardContent className="p-0">
                <div className="w-full aspect-[2/3] overflow-hidden">
                  <img
                    src={`/buku/coverbuku/${book.gambar}`}
                    alt={book.judul}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-3">
                  <h2 className="text-sm font-semibold line-clamp-2">
                    {book.judul}
                  </h2>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
