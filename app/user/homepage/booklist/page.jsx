"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function BookList() {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/buku?limit=30");
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Book List</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {books.map((book) => (
          <Card
            key={book.id_buku}
            className="rounded-xl overflow-hidden shadow hover:scale-[1.03] transition p-0"
          >
            <CardContent className="p-0">
              
              <div className="w-full h-80 overflow-hidden">
                <img
                  src={`/buku/coverbuku/${book.gambar}`}
                  alt={book.judul}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x400?text=No+Image";
                  }}
                />
              </div>

              <div className="p-3">
                <h2 className="text-sm font-medium line-clamp-2">
                  {book.judul}
                </h2>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
