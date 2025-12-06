import { NextResponse } from "next/server";
import getDb from "@/app/lib/database";

// GET: single category with book count
export async function GET(_req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "ID kategori tidak ditemukan" },
        { status: 400 }
      );
    }

    const db = await getDb();

    const [rows] = await db.query(
      `
      SELECT 
        k.id_kategori, 
        k.nama, 
        COUNT(b.id_buku) AS total_buku
      FROM kategori_buku k
      LEFT JOIN buku b ON b.id_kategori = k.id_kategori
      WHERE k.id_kategori = ?
      GROUP BY k.id_kategori, k.nama
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("KATEGORI DETAIL ERROR:", error);
    return NextResponse.json(
      { message: "Gagal mengambil detail kategori", error: error.message },
      { status: 500 }
    );
  }
}
