import { NextResponse } from "next/server";
import getDb from "@/app/lib/database";

// ==== PUT: USER KEMBALIKAN BUKU ====
export async function PUT(req, { params }) {
  try {
    const db = await getDb();
    const { id } = await params; // id_peminjaman

    console.log("========== PENGEMBALIAN BUKU ==========");
    console.log("📋 Peminjaman ID:", id);

    // === 1. CEK PEMINJAMAN ADA & STATUSNYA ===
    const [peminjamanRows] = await db.query(
      `SELECT p.*, b.judul 
       FROM peminjaman p
       JOIN buku b ON p.id_book = b.id_buku
       WHERE p.id_peminjaman = ?`,
      [id]
    );

    if (peminjamanRows.length === 0) {
      return NextResponse.json(
        { message: "Peminjaman tidak ditemukan" },
        { status: 404 }
      );
    }

    const peminjaman = peminjamanRows[0];

    if (peminjaman.status !== "diterima") {
      return NextResponse.json(
        { message: `Buku dengan status "${peminjaman.status}" tidak bisa dikembalikan` },
        { status: 400 }
      );
    }

    console.log("📚 Buku:", peminjaman.judul);

    // === 2. CEK APAKAH TERLAMBAT ===
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const returnDate = new Date(peminjaman.tanggal_pengembalian);
    returnDate.setHours(0, 0, 0, 0);
    
    const diffTime = returnDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const isTerlambat = diffDays < 0;
    const newStatus = isTerlambat ? "terlambat" : "dikembalikan";

    console.log("📅 Tanggal kembali:", peminjaman.tanggal_pengembalian);
    console.log("📅 Hari ini:", today.toISOString().split("T")[0]);
    console.log("⏰ Selisih hari:", diffDays);
    console.log("📊 Status baru:", newStatus);

    // === 3. UPDATE STATUS & TANGGAL PENGEMBALIAN AKTUAL ===
    const tanggalPengembalianAktual = new Date().toISOString().split("T")[0];

    await db.query(
      `UPDATE peminjaman 
       SET status = ?, pengembalian = ? 
       WHERE id_peminjaman = ?`,
      [newStatus, tanggalPengembalianAktual, id]
    );

    // === 4. TAMBAH STOK BUKU KEMBALI ===
    await db.query(
      "UPDATE buku SET stok = stok + 1 WHERE id_buku = ?",
      [peminjaman.id_book]
    );

    console.log("✅ Buku berhasil dikembalikan");
    console.log("📦 Stok ditambah kembali");
    console.log("======================================\n");

    return NextResponse.json({
      message: isTerlambat 
        ? `Buku berhasil dikembalikan (Terlambat ${Math.abs(diffDays)} hari)` 
        : "Buku berhasil dikembalikan tepat waktu!",
      data: {
        id_peminjaman: id,
        judul: peminjaman.judul,
        status: newStatus,
        keterlambatan: isTerlambat ? Math.abs(diffDays) : 0,
        tanggal_pengembalian_aktual: tanggalPengembalianAktual,
      },
    });

  } catch (error) {
    console.error("❌ PENGEMBALIAN ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: error.message },
      { status: 500 }
    );
  }
}