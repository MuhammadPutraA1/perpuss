import { NextResponse } from "next/server";
import getDb from "@/app/lib/database";

// ==== PUT: ADMIN APPROVE/REJECT REQUEST ====
export async function PUT(req, { params }) {
  try {
    const db = await getDb();
    const { id } =await params; // id_peminjaman
    const { action, id_admin } = await req.json(); // action: 'approve' atau 'reject'

    console.log("========== APPROVAL PEMINJAMAN ==========");
    console.log(" Peminjaman ID:", id);
    console.log(" Action:", action);
    console.log(" Admin ID:", id_admin);

    // === 1. CEK PEMINJAMAN ADA & STATUSNYA ===
    const [peminjamanRows] = await db.query(
      `SELECT p.*, b.judul, b.stok 
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

    if (peminjaman.status !== 'tertunda') {
      return NextResponse.json(
        { message: `Peminjaman sudah di-${peminjaman.status}` },
        { status: 400 }
      );
    }

    console.log(" Buku:", peminjaman.judul);
    console.log(" Stok saat ini:", peminjaman.stok);

    // === 2. PROSES BERDASARKAN ACTION ===
    if (action === 'approve') {
      // CEK STOK MASIH ADA
      if (peminjaman.stok <= 0) {
        return NextResponse.json(
          { message: "Stok buku habis, tidak bisa approve" },
          { status: 400 }
        );
      }

      // UPDATE STATUS JADI DITERIMA
      await db.query(
        `UPDATE peminjaman 
         SET status = 'diterima', id_admin = ? 
         WHERE id_peminjaman = ?`,
        [id_admin, id]
      );

      // KURANGI STOK
      await db.query(
        "UPDATE buku SET stok = stok - 1 WHERE id_buku = ?",
        [peminjaman.id_book]
      );

      console.log(" Request APPROVED");
      console.log(" Stok dikurangi");

      return NextResponse.json({
        message: "Request peminjaman disetujui!",
        data: {
          id_peminjaman: id,
          judul: peminjaman.judul,
          status: "diterima",
        },
      });

    } else if (action === 'reject') {
      // UPDATE STATUS JADI DITOLAK
      await db.query(
        `UPDATE peminjaman 
         SET status = 'ditolak', id_admin = ? 
         WHERE id_peminjaman = ?`,
        [id_admin, id]
      );

      console.log(" Request REJECTED");

      return NextResponse.json({
        message: "Request peminjaman ditolak",
        data: {
          id_peminjaman: id,
          judul: peminjaman.judul,
          status: "ditolak",
        },
      });

    } else {
      return NextResponse.json(
        { message: "Action tidak valid. Gunakan 'approve' atau 'reject'" },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("❌ APPROVAL ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: error.message },
      { status: 500 }
    );
  }
}