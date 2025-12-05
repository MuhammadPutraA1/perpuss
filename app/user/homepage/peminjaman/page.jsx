"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle } from "lucide-react";

export default function PeminjamanUserPage() {
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState(null);
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const fetchPeminjaman = async () => {
    if (!user) return;

    setLoading(true);
    const url = filter === "all" 
      ? `/api/peminjaman?user=${user.id_users}`
      : `/api/peminjaman?user=${user.id_users}&status=${filter}`;

    const res = await fetch(url);
    const data = await res.json();
    setPeminjaman(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPeminjaman();
  }, [user, filter]);

  // HANDLE KEMBALIKAN BUKU
  const handleKembalikan = async (id_peminjaman, judul) => {
    const confirm = window.confirm(
      `Kembalikan buku "${judul}"?\n\nPastikan Anda sudah menyerahkan buku ke perpustakaan.`
    );

    if (!confirm) return;

    setReturning(id_peminjaman);

    try {
      const res = await fetch(`/api/peminjaman/pengembalian/${id_peminjaman}`, {
        method: "PUT",
      });

      const data = await res.json();

      if (res.ok) {
        alert(
          `✅ ${data.message}\n\n` +
          `📚 Buku: ${data.data.judul}\n` +
          `📅 Dikembalikan: ${data.data.tanggal_pengembalian_aktual}\n` +
          (data.data.keterlambatan > 0 
            ? `⚠️ Keterlambatan: ${data.data.keterlambatan} hari` 
            : `✅ Tepat waktu!`)
        );

        // Refresh data
        fetchPeminjaman();
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat mengembalikan buku");
    }

    setReturning(null);
  };

  // HITUNG SISA HARI
  const hitungSisaHari = (tanggalKembali, status) => {
    if (status !== "diterima") return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const returnDate = new Date(tanggalKembali);
    returnDate.setHours(0, 0, 0, 0);
    
    const diffTime = returnDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // STATUS BADGE dengan pengecekan keterlambatan
  const getStatusInfo = (item) => {
    const { status, tanggal_pengembalian } = item;
    
    if (status === "diterima") {
      const sisaHari = hitungSisaHari(tanggal_pengembalian, status);
      
      if (sisaHari < 0) {
        return {
          badge: (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white flex items-center gap-1 w-fit">
              <AlertTriangle size={14} />
              ⚠️ Terlambat {Math.abs(sisaHari)} hari
            </span>
          ),
          detail: (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
              <p className="text-red-800 text-sm font-semibold">
                ⚠️ Buku Anda sudah terlambat {Math.abs(sisaHari)} hari!
              </p>
              <p className="text-red-600 text-xs mt-1">
                Harap segera kembalikan untuk menghindari denda atau sanksi.
              </p>
            </div>
          ),
          priority: 1
        };
      } else if (sisaHari <= 2) {
        return {
          badge: (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 flex items-center gap-1 w-fit">
              <Clock size={14} />
              ⏰ {sisaHari} hari lagi
            </span>
          ),
          detail: (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-2">
              <p className="text-orange-800 text-sm font-semibold">
                ⏰ Deadline {sisaHari} hari lagi!
              </p>
              <p className="text-orange-600 text-xs mt-1">
                Segera kembalikan sebelum tanggal {new Date(tanggal_pengembalian).toLocaleDateString("id-ID")}.
              </p>
            </div>
          ),
          priority: 2
        };
      } else {
        return {
          badge: (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
              ✅ Sedang Dipinjam ({sisaHari} hari lagi)
            </span>
          ),
          detail: null,
          priority: 3
        };
      }
    }

    const statusConfig = {
      tertunda: {
        badge: (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            ⏳ Menunggu Approval
          </span>
        ),
        detail: null,
        priority: 4
      },
      dikembalikan: {
        badge: (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            📚 Dikembalikan
          </span>
        ),
        detail: null,
        priority: 5
      },
      terlambat: {
        badge: (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            📚 Dikembalikan (Terlambat)
          </span>
        ),
        detail: null,
        priority: 5
      },
      ditolak: {
        badge: (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            ❌ Ditolak
          </span>
        ),
        detail: null,
        priority: 6
      }
    };

    return statusConfig[status] || { badge: null, detail: null, priority: 99 };
  };

  const formatTanggal = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const sortedPeminjaman = [...peminjaman].sort((a, b) => {
    const priorityA = getStatusInfo(a).priority;
    const priorityB = getStatusInfo(b).priority;
    return priorityA - priorityB;
  });

  if (!user) {
    return <p className="p-6">Loading...</p>;
  }

  const stats = {
    terlambat: peminjaman.filter(p => {
      if (p.status !== "diterima") return false;
      const sisa = hitungSisaHari(p.tanggal_pengembalian, p.status);
      return sisa !== null && sisa < 0;
    }).length,
    aktif: peminjaman.filter(p => p.status === "diterima").length,
    tertunda: peminjaman.filter(p => p.status === "tertunda").length,
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📚 Peminjaman Buku Saya</h1>

      {stats.terlambat > 0 && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 rounded">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-600" size={20} />
            <p className="text-red-800 font-semibold">
              Anda memiliki {stats.terlambat} buku yang terlambat dikembalikan!
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{stats.aktif}</p>
          <p className="text-sm text-green-600">Sedang Dipinjam</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-700">{stats.tertunda}</p>
          <p className="text-sm text-yellow-600">Menunggu Approval</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{stats.terlambat}</p>
          <p className="text-sm text-red-600">Terlambat</p>
        </div>
      </div>

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

      {loading ? (
        <p>Loading...</p>
      ) : peminjaman.length === 0 ? (
        <Card className="p-6 text-center text-gray-500">
          Belum ada peminjaman
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedPeminjaman.map((item) => {
            const statusInfo = getStatusInfo(item);
            
            return (
              <Card key={item.id_peminjaman} className={`overflow-hidden ${
                statusInfo.priority === 1 ? 'border-2 border-red-500' : 
                statusInfo.priority === 2 ? 'border-2 border-orange-400' : ''
              }`}>
                <CardContent className="p-0">
                  <div className="flex gap-4 p-4">
                    <img
                      src={`/buku/coverbuku/${item.gambar}`}
                      alt={item.judul}
                      className="w-20 h-28 object-cover rounded shadow"
                      onError={(e) => {
                        e.target.src = '/buku/coverbuku/default.jpg';
                      }}
                    />

                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-gray-800 line-clamp-2">
                        {item.judul}
                      </h3>
                      <p className="text-sm text-gray-600">{item.penulis}</p>

                      {statusInfo.badge}

                      <div className="text-xs text-gray-500 space-y-1 mt-2">
                        <p>📅 Pinjam: {formatTanggal(item.tanggal_peminjaman)}</p>
                        <p className={statusInfo.priority === 1 ? 'text-red-600 font-semibold' : ''}>
                          📅 Kembali: {formatTanggal(item.tanggal_pengembalian)}
                        </p>
                        {item.pengembalian && (
                          <p>✅ Dikembalikan: {formatTanggal(item.pengembalian)}</p>
                        )}
                      </div>

                      {statusInfo.detail}

                      {/* TOMBOL KEMBALIKAN (hanya untuk status diterima) */}
                      {item.status === "diterima" && (
                        <Button
                          onClick={() => handleKembalikan(item.id_peminjaman, item.judul)}
                          disabled={returning === item.id_peminjaman}
                          className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                          size="sm"
                        >
                          {returning === item.id_peminjaman ? "Processing..." : "📤 Kembalikan Buku"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}