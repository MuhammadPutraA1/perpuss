import { NextResponse } from "next/server";
import getDb from "@/app/lib/database";

export async function GET(req, { params }) {
  try {
    const db = await getDb();
    const { id } = params;

    const [rows] = await db.query(
      `SELECT 
        id_buku,
        isbn,
        judul,
        deskripsi,
        penulis,
        penerbit,
        total_halaman,
        tahun,
        id_kategori,
        stok,
        id_rak,
        dibuat_pada,
        gambar
      FROM buku 
      WHERE id_buku = ? LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Buku tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0], { status: 200 });

  } catch (err) {
    console.error("GET BOOK DETAIL ERROR:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
