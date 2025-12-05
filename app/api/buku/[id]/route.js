import { NextResponse } from "next/server";
import getDb from "@/app/lib/database";

export async function GET(req, context) {
  try {
    const params = await context.params;
    console.log("RAW PARAMS:", params);

    const id = params.id;
    console.log("ID YANG DITERIMA:", id);

    const db = await getDb();

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

    console.log("HASIL QUERY:", rows);

    if (rows.length === 0) {
      console.log("BUKU TIDAK DITEMUKAN");
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
