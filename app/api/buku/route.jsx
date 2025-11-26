import getDb from "@/app/lib/database";
import { NextResponse } from "next/server";

// GET
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit")) || 20;

  try {
    const db = await getDb();
    const [rows] = await db.query(`
      SELECT 
        b.id_buku,
        b.gambar,
        b.judul,
        k.nama
      FROM buku b
      LEFT JOIN kategori_buku  k 
        ON k.id_kategori = b.id_kategori
      ORDER BY b.dibuat_pada DESC
      LIMIT ${limit};
    `);

    return NextResponse.json(rows);

  } catch (err) {
    console.error("BUKU API ERROR:", err);
    return new NextResponse("Error fetching books", { status: 500 });
  }
}


// POST
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      isbn,
      judul,
      penulis,
      penerbit,
      total_halaman,
      tahun,
      id_kategori,
      stok,
      id_rak,
    } = body;

    const dibuat_pada = new Date();

    await db.query(
      `INSERT INTO buku 
      (isbn, judul, penulis, penerbit, total_halaman, tahun, id_kategori, stok, id_rak, dibuat_pada)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        isbn,
        judul,
        penulis,
        penerbit,
        total_halaman,
        tahun,
        id_kategori,
        stok,
        id_rak,
        dibuat_pada,
      ]
    );

    return Response.json({ message: "Buku berhasil ditambahkan" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// PUT
export async function PUT(req) {
  try {
    const body = await req.json();
    const {
      id_buku,
      isbn,
      judul,
      penulis,
      penerbit,
      total_halaman,
      tahun,
      id_kategori,
      stok,
      id_rak,
    } = body;

    await db.query(
      `UPDATE buku SET
        isbn = ?,
        judul = ?,
        penulis = ?,
        penerbit = ?,
        total_halaman = ?,
        tahun = ?,
        id_kategori = ?,
        stok = ?,
        id_rak = ?
      WHERE id_buku = ?`,
      [
        isbn,
        judul,
        penulis,
        penerbit,
        total_halaman,
        tahun,
        id_kategori,
        stok,
        id_rak,
        id_buku,
      ]
    );

    return Response.json({ message: "Buku berhasil diupdate" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await db.query("DELETE FROM buku WHERE id_buku = ?", [id]);
    return Response.json({ message: "Buku berhasil dihapus" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
