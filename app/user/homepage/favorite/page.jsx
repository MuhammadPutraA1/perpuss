"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function FavoritePage() {
  const [favorites, setFavorites] = useState([]);

  // nanti tinggal fetch API favorit di sini
  useEffect(() => {
    async function fetchFavorites() {
      // const res = await fetch("/api/books/favorite");
      // setFavorites(await res.json());
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((book, index) => (
          <Card key={index} className="h-52 p-4 flex flex-col justify-between">
            <div className="w-full h-28 bg-gray-200 rounded-xl" />
            <CardContent className="px-0 mt-3">
              <h3 className="font-semibold text-gray-800">{book.title}</h3>
              <p className="text-sm text-gray-500">{book.author}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
