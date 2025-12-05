"use client";

import React, { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    activeLoans: 0,
  });
  const [activeLoans, setActiveLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH STATISTICS
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total users
        console.log("🔍 Fetching users...");
        const usersRes = await fetch("/api/users");
        console.log("📡 Users response status:", usersRes.status);

        if (!usersRes.ok) {
          console.error("❌ Users API error:", await usersRes.text());
          throw new Error("Failed to fetch users");
        }
        const usersData = await usersRes.json();
        console.log("✅ Users data:", usersData);

        // Fetch total books
        console.log("🔍 Fetching books...");
        const booksRes = await fetch("/api/buku");
        console.log("📡 Books response status:", booksRes.status);

        if (!booksRes.ok) {
          console.error("❌ Books API error:", await booksRes.text());
          throw new Error("Failed to fetch books");
        }
        const booksData = await booksRes.json();
        console.log("✅ Books data:", booksData);

        // Fetch active loans (status: diterima)
        console.log("🔍 Fetching active loans...");
        const loansRes = await fetch("/api/peminjaman/active");
        console.log("📡 Loans response status:", loansRes.status);

        if (!loansRes.ok) {
          console.error("❌ Loans API error:", await loansRes.text());
          throw new Error("Failed to fetch active loans");
        }
        const loansData = await loansRes.json();
        console.log("✅ Loans data:", loansData);

        setStats({
          totalUsers: usersData.length || 0,
          totalBooks: booksData.length || 0,
          activeLoans: loansData.length || 0,
        });

        setActiveLoans(loansData);
      } catch (error) {
        console.error("❌ Error fetching stats:", error);
        alert("Error loading dashboard data. Check console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // FORMAT TANGGAL
  const formatTanggal = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // HITUNG SISA HARI
  const hitungSisaHari = (tanggalKembali) => {
    const today = new Date();
    const returnDate = new Date(tanggalKembali);
    const diffTime = returnDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // STATUS BADGE
  const getStatusBadge = (sisaHari) => {
    if (sisaHari < 0) {
      return <span className="text-red-600 font-semibold">⚠️ Terlambat {Math.abs(sisaHari)} hari</span>;
    } else if (sisaHari <= 2) {
      return <span className="text-orange-600 font-semibold">⏰ {sisaHari} hari lagi</span>;
    } else {
      return <span className="text-green-600">{sisaHari} hari lagi</span>;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow p-5 rounded-lg">
          <p className="text-gray-600">Total Users</p>
          <h2 className="text-3xl font-semibold">
            {loading ? "..." : stats.totalUsers}
          </h2>
        </div>
        <div className="bg-white shadow p-5 rounded-lg">
          <p className="text-gray-600">Books Available</p>
          <h2 className="text-3xl font-semibold">
            {loading ? "..." : stats.totalBooks}
          </h2>
        </div>
        <div className="bg-white shadow p-5 rounded-lg">
          <p className="text-gray-600">Active Loans</p>
          <h2 className="text-3xl font-semibold">
            {loading ? "..." : stats.activeLoans}
          </h2>
        </div>
      </div>

      {/* Active Loans Table */}
      <div className="bg-white shadow p-5 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">📚 Buku yang Sedang Dipinjam</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : activeLoans.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Tidak ada buku yang sedang dipinjam
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-600 bg-gray-50">
                  <th className="py-3 px-2">User</th>
                  <th className="py-3 px-2">Buku</th>
                  <th className="py-3 px-2">Tanggal Pinjam</th>
                  <th className="py-3 px-2">Harus Kembali</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {activeLoans.map((loan) => {
                  const sisaHari = hitungSisaHari(loan.tanggal_pengembalian);
                  return (
                    <tr key={loan.id_peminjaman} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium text-gray-800">{loan.username}</p>
                          <p className="text-xs text-gray-500">{loan.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={`/buku/coverbuku/${loan.gambar}`}
                            alt={loan.judul}
                            className="w-10 h-14 object-cover rounded shadow-sm"
                          />
                          <div>
                            <p className="font-medium text-gray-800">{loan.judul}</p>
                            <p className="text-xs text-gray-500">{loan.penulis}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-gray-700">
                        {formatTanggal(loan.tanggal_peminjaman)}
                      </td>
                      <td className="py-3 px-2 text-gray-700">
                        {formatTanggal(loan.tanggal_pengembalian)}
                      </td>
                      <td className="py-3 px-2">
                        {getStatusBadge(sisaHari)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}