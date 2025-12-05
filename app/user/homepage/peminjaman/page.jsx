"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function PeminjamanUserPage() {
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, tertunda, diterima, dikembalikan, ditolak
  const [user, setUser] = useState(null);

  // GET USER
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // FETCH PEMINJAMAN
  useEffect(() => {
    if (!user) return;

    const fetchPeminjaman = async () => {
      setLoading(true);
      const url = filter === "all" 
        ? `/api/peminjaman?user=${user.id_users}`
        : `/api/peminjaman?user=${user.id_users}&status=${filter}`;

      const res = await fetch(url);
      const data = await res.json();
      setPeminjaman(data);
      setLoading(false);
    };

    fetchPeminjaman();
  }, [user, filter]);

  // STATUS BADGE
  const getStatusBadge = (status) => {
    const styles = {
      tertunda: "bg-yellow-100 text-yellow-800",
      diterima: "bg-green-100 text-green-800",
      dikembalikan: "bg-blue-100 text-blue-800",
      ditolak: "bg-red-100 text-red-800",
      terlambat: "bg-red-600 text-white",
    };

    const labels = {
      tertunda: "⏳ Menunggu Approval",
      diterima: "✅ Sedang Dipinjam",
      dikembalikan: "📚 Dikembalikan",
      ditolak: "❌ Ditolak",
      terlambat: "⚠️ Terlambat",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  // FORMAT TANGGAL
  const formatTanggal = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!user) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📚 Peminjaman Buku Saya</h1>

      {/* FILTER TABS */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["all", "tertunda", "diterima", "dikembalikan", "ditolak"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              filter === status
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status === "all" ? "Semua" : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* LIST PEMINJAMAN */}
      {loading ? (
        <p>Loading...</p>
      ) : peminjaman.length === 0 ? (
        <Card className="p-6 text-center text-gray-500">
          Belum ada peminjaman
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {peminjaman.map((item) => (
            <Card key={item.id_peminjaman} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                  {/* COVER BUKU */}
                  <img
                    src={`/buku/coverbuku/${item.gambar}`}
                    alt={item.judul}
                    className="w-20 h-28 object-cover rounded shadow"
                  />

                  {/* INFO */}
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-gray-800 line-clamp-2">
                      {item.judul}
                    </h3>
                    <p className="text-sm text-gray-600">{item.penulis}</p>

                    {getStatusBadge(item.status)}

                    <div className="text-xs text-gray-500 space-y-1 mt-2">
                      <p>📅 Pinjam: {formatTanggal(item.tanggal_peminjaman)}</p>
                      <p>📅 Kembali: {formatTanggal(item.tanggal_pengembalian)}</p>
                      {item.pengembalian && (
                        <p>✅ Dikembalikan: {formatTanggal(item.pengembalian)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}