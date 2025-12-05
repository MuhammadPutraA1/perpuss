"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function FavoritePage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    async function fetchFavorites() {
      const res = await fetch("/api/favorit?user=1");
      const data = await res.json();
      setFavorites(data);
    }
    fetchFavorites();
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-8">
      <h1 className="text-xl font-bold text-gray-800 mb-2">Favorite Books</h1>

      {favorites.length === 0 && (
        <div className="text-gray-500 text-sm italic">
          You haven't added any favorite books yet.
        </div>
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
