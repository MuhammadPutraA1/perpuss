"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function DetailBukuPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      const res = await fetch(`/api/buku/${id}`);
      const data = await res.json();
      setBook(data);
    };
    fetchDetail();
  }, [id]);

  if (!book) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{book.judul}</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={`/buku/coverbuku/${book.gambar}`}
          className="w-64 h-96 object-cover rounded-lg shadow bg-gray-100"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/300x400?text=No+Image";
          }}
        />

        <div className="space-y-3 text-gray-800">
          <p><strong>ISBN:</strong> {book.isbn}</p>
          <p><strong>Penulis:</strong> {book.penulis}</p>
          <p><strong>Penerbit:</strong> {book.penerbit}</p>
          <p><strong>Tahun Terbit:</strong> {book.tahun}</p>
          <p><strong>Total Halaman:</strong> {book.total_halaman}</p>
          <p><strong>Stok:</strong> {book.stok}</p>
          <p><strong>ID Kategori:</strong> {book.id_kategori}</p>

          <div>
            <strong>Deskripsi:</strong>
            <p className="mt-1 text-gray-700 leading-relaxed">
              {book.deskripsi || "Tidak ada deskripsi."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
