import { NextResponse } from "next/server";
import getDb from "@/app/lib/database";

// GET: list all categories with optional search/limit
export async function GET(req) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);

    const limitParam = parseInt(searchParams.get("limit"), 10);
    const search = searchParams.get("q");

    const queryParts = [
      `SELECT k.id_kategori, k.nama, COUNT(b.id_buku) AS total_buku`,
      `FROM kategori_buku k`,
      `LEFT JOIN buku b ON b.id_kategori = k.id_kategori`,
    ];

    const params = [];

    if (search) {
      queryParts.push(`WHERE k.nama LIKE ?`);
      params.push(`%${search}%`);
    }

    queryParts.push(`GROUP BY k.id_kategori, k.nama`);
    queryParts.push(`ORDER BY k.nama ASC`);

    if (!Number.isNaN(limitParam) && limitParam > 0) {
      queryParts.push(`LIMIT ?`);
      params.push(limitParam);
    }

    const [rows] = await db.query(queryParts.join(" "), params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("KATEGORI GET ERROR:", error);
    return NextResponse.json(
      { message: "Gagal mengambil daftar kategori", error: error.message },
      { status: 500 }
    );
  }
}
