import { NextResponse } from "next/server";
import getDb from "@/app/lib/database";

// ==== GET: AMBIL SEMUA REQUEST YANG TERTUNDA (UNTUK ADMIN) ====
export async function GET(req) {
  try {
    const db = await getDb();

    const [rows] = await db.query(`
      SELECT 
        p.id_peminjaman,
        p.id_users,
        p.id_book,
        p.tanggal_peminjaman,
        p.tanggal_pengembalian,
        p.status,
        b.judul,
        b.penulis,
        b.gambar,
        b.stok,
        u.username,
        u.email
      FROM peminjaman p
      JOIN buku b ON p.id_book = b.id_buku
      JOIN users u ON p.id_users = u.id_users
      WHERE p.status = 'tertunda'
      ORDER BY p.tanggal_peminjaman DESC
    `);

    return NextResponse.json(rows);

  } catch (error) {
    console.error("❌ GET PENDING REQUESTS ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}