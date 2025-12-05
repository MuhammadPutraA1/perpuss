"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminPeminjamanPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [admin, setAdmin] = useState(null);

  // GET ADMIN
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setAdmin(JSON.parse(userData));
    }
  }, []);

  // FETCH PENDING REQUESTS
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/peminjaman/pending");
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // HANDLE APPROVE
  const handleApprove = async (id_peminjaman, judul) => {
    if (!admin) return;

    const confirm = window.confirm(
      `Setujui request peminjaman buku "${judul}"?\n\nStok akan berkurang setelah disetujui.`
    );
    if (!confirm) return;

    setProcessing(id_peminjaman);

    try {
      const res = await fetch(`/api/peminjaman/${id_peminjaman}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          id_admin: admin.id_users,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${data.message}\n\nBuku: ${data.data.judul}\nStatus: ${data.data.status}`);
        fetchRequests(); // Refresh list
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat approve");
    }

    setProcessing(null);
  };

  // HANDLE REJECT
  const handleReject = async (id_peminjaman, judul) => {
    if (!admin) return;

    const confirm = window.confirm(
      `Tolak request peminjaman buku "${judul}"?`
    );
    if (!confirm) return;

    setProcessing(id_peminjaman);

    try {
      const res = await fetch(`/api/peminjaman/${id_peminjaman}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject",
          id_admin: admin.id_users,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${data.message}\n\nBuku: ${data.data.judul}\nStatus: ${data.data.status}`);
        fetchRequests(); // Refresh list
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat reject");
    }

    setProcessing(null);
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📋 Request Peminjaman Buku</h1>
        <Button 
          onClick={fetchRequests} 
          variant="outline"
          disabled={loading}
        >
          {loading ? "Loading..." : "🔄 Refresh"}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-2">
            <svg 
              className="w-16 h-16 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">Tidak ada request peminjaman yang menunggu</p>
          <p className="text-gray-400 text-sm mt-2">Semua request sudah diproses</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Total request menunggu: <strong>{requests.length}</strong>
          </p>

          {requests.map((item) => (
            <Card key={item.id_peminjaman} className="overflow-hidden hover:shadow-lg transition">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row gap-4 p-5">
                  
                  {/* COVER BUKU */}
                  <div className="flex-shrink-0">
                    <img
                      src={`/buku/coverbuku/${item.gambar}`}
                      alt={item.judul}
                      className="w-24 h-32 object-cover rounded-lg shadow"
                    />
                  </div>

                  {/* INFO BUKU & USER */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg mb-1">
                        {item.judul}
                      </h3>
                      <p className="text-sm text-gray-600">{item.penulis}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="space-y-2">
                        <p className="text-gray-700">
                          <span className="font-semibold">👤 Peminjam:</span> {item.username}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">📧 Email:</span> {item.email}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-gray-700">
                          <span className="font-semibold">📅 Tanggal Request:</span> {formatTanggal(item.tanggal_peminjaman)}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">📅 Estimasi Kembali:</span> {formatTanggal(item.tanggal_pengembalian)}
                        </p>
                        <p className={`font-semibold ${item.stok > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          📦 Stok: {item.stok} {item.stok <= 0 && "(Habis)"}
                        </p>
                      </div>
                    </div>

                    {/* WARNING STOK HABIS */}
                    {item.stok <= 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-700 text-sm font-medium">
                          ⚠️ Stok buku habis. Request tidak bisa disetujui sampai ada stok tersedia.
                        </p>
                      </div>
                    )}

                    {/* TOMBOL AKSI */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={() => handleApprove(item.id_peminjaman, item.judul)}
                        disabled={processing === item.id_peminjaman || item.stok <= 0}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {processing === item.id_peminjaman ? "Processing..." : "✅ Setujui"}
                      </Button>

                      <Button
                        onClick={() => handleReject(item.id_peminjaman, item.judul)}
                        disabled={processing === item.id_peminjaman}
                        variant="destructive"
                      >
                        {processing === item.id_peminjaman ? "Processing..." : "❌ Tolak"}
                      </Button>
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