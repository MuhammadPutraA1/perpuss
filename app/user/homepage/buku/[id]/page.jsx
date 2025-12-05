"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookUser } from "lucide-react";

export default function DetailBukuPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [books, setBooks] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // ==== GET USER FROM LOCALSTORAGE ====
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // ==== FETCH DETAIL BUKU ====
  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      const res = await fetch(`/api/buku/${id}`);
      const data = await res.json();
      setBooks(data);
    };
    fetchDetail();
  }, [id]);

  // ==== CEK APAKAH SUDAH FAVORIT ====
  useEffect(() => {
    if (!id || !user) return;

    const checkFavorite = async () => {
      const res = await fetch(`/api/favorit?user=${user.id_users}`);
      const data = await res.json();

      const found = data.some((item) => item.id_buku == id);
      setIsFavorite(found);
    };

    checkFavorite();
  }, [id, user]);

  // ==== TAMBAH FAVORIT ====
  const addFavorite = async () => {
    if (!user) {
      alert("Anda harus login terlebih dahulu");
      return;
    }

    const res = await fetch("/api/favorit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_users: user.id_users,
        id_buku: id,
      }),
    });

    const data = await res.json();
    alert(data.message);
    setIsFavorite(true);
  };

  // ==== HAPUS FAVORIT ====
  const removeFavorite = async () => {
    if (!user) return;

    const res = await fetch(`/api/favorit?user=${user.id_users}&id_buku=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    alert(data.message);
    setIsFavorite(false);
  };

  // ==== REQUEST PINJAM BUKU ====
  const handleRequestPinjam = async () => {
    if (!user) {
      alert("Anda harus login terlebih dahulu");
      router.push("/login");
      return;
    }

    if (books.stok <= 0) {
      alert("Maaf, stok buku habis");
      return;
    }

    // Konfirmasi
    const confirm = window.confirm(
      `Request peminjaman buku "${books.judul}"?\n\n` +
      `Durasi: 7 hari\n` +
      `Status: Menunggu approval admin\n` +
      `Stok tersisa: ${books.stok}`
    );

    if (!confirm) return;

    setLoading(true);

    try {
      const res = await fetch("/api/peminjaman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_users: user.id_users,
          id_buku: id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(
        `✅ ${data.message}\n\n` +
        `📚 Buku: ${data.data.judul}\n` +
        `⏳ Status: ${data.data.status}\n` +
        `📅 Tanggal Request: ${data.data.tanggal_request}\n` +
        `📅 Estimasi Kembali: ${data.data.estimasi_kembali}\n\n` +
        `Silakan cek halaman "Peminjaman" untuk melihat status.`
      );

      // Redirect ke halaman peminjaman
      setTimeout(() => {
        router.push("/user/peminjaman");
      }, 2000);

    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat request peminjaman");
    } finally {
      setLoading(false);
    }
  };

  if (!books) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{books.judul}</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={`/buku/coverbuku/${books.gambar}`}
          alt={books.judul}
          className="w-64 h-96 object-cover rounded-lg shadow bg-gray-100"
        />

        <div className="space-y-3 text-gray-800">
          <p><strong>ISBN:</strong> {books.isbn}</p>
          <p><strong>Penulis:</strong> {books.penulis}</p>
          <p><strong>Penerbit:</strong> {books.penerbit}</p>
          <p><strong>Tahun Terbit:</strong> {books.tahun}</p>
          <p><strong>Total Halaman:</strong> {books.total_halaman}</p>
          <p>
            <strong>Stok:</strong>{" "}
            <span className={books.stok > 0 ? "text-green-600" : "text-red-600"}>
              {books.stok} {books.stok <= 0 && "(Habis)"}
            </span>
          </p>

          <div>
            <strong>Deskripsi:</strong>
            <p className="mt-1 text-gray-700 leading-relaxed">
              {books.deskripsi || "Tidak ada deskripsi."}
            </p>
          </div>

          {/* TOMBOL Aksi */}
          <div className="flex gap-4 pt-4">

            {/* === TOMBOL REQUEST PINJAM === */}
            <button
              onClick={handleRequestPinjam}
              disabled={loading || books.stok <= 0}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg shadow transition ${
                loading || books.stok <= 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <BookUser size={20} />
              {loading ? "Memproses..." : books.stok <= 0 ? "Stok Habis" : "Request Pinjam"}
            </button>

            {/* === TOMBOL FAVORIT === */}
            <button
              onClick={isFavorite ? removeFavorite : addFavorite}
              className={`px-4 py-2 rounded-lg text-white transition ${
                isFavorite
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-pink-600 hover:bg-pink-700"
              }`}
            >
              {isFavorite ? "🗑 Hapus dari Favorit" : "❤️ Tambah ke Favorit"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}