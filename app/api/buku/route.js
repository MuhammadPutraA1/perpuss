import getDb from "@/app/lib/database";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

// ==== GET: FETCH ALL BOOKS ====
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limitParam = parseInt(searchParams.get("limit"), 10);
  const limit = Number.isNaN(limitParam) ? 100 : limitParam;
  const kategoriParamRaw = searchParams.get("kategori");
  const kategoriFilterProvided =
    kategoriParamRaw !== null && kategoriParamRaw !== undefined && kategoriParamRaw !== "";
  const kategoriId = kategoriFilterProvided
    ? parseInt(kategoriParamRaw, 10)
    : null;

  try {
    const db = await getDb();
    const params = [];
    let whereClause = "";

    if (kategoriFilterProvided && !Number.isNaN(kategoriId)) {
      whereClause = "WHERE b.id_kategori = ?";
      params.push(kategoriId);
    }

    const [rows] = await db.query(`
      SELECT 
        b.id_buku,
        b.isbn,
        b.judul,
        b.deskripsi,
        b.penulis,
        b.penerbit,
        b.total_halaman,
        b.tahun,
        b.id_kategori,
        b.stok,
        b.id_rak,
        b.dibuat_pada,
        b.gambar,
        k.nama as kategori
      FROM buku b
      LEFT JOIN kategori_buku k 
        ON k.id_kategori = b.id_kategori
      ${whereClause}
      ORDER BY b.dibuat_pada DESC
      LIMIT ?
    `, [...params, limit]);

    return NextResponse.json(rows);

  } catch (err) {
    console.error("❌ BUKU GET ERROR:", err);
    return NextResponse.json(
      { message: "Error fetching books", error: err.message },
      { status: 500 }
    );
  }
}

// ==== POST: ADD NEW BOOK WITH IMAGE UPLOAD ====
export async function POST(req) {
  try {
    const db = await getDb();
    const formData = await req.formData();

    // Extract form fields
    const isbn = formData.get("isbn");
    const judul = formData.get("judul");
    const penulis = formData.get("penulis");
    const penerbit = formData.get("penerbit");
    const tahun = formData.get("tahun");
    const total_halaman = formData.get("total_halaman") || 0;
    const stok = formData.get("stok");
    const deskripsi = formData.get("deskripsi") || "";
    const id_rak = formData.get("id_rak") || null;
    
    // Kategori handling
    let id_kategori = formData.get("id_kategori");
    const kategori_nama = formData.get("kategori");

    // Jika input kategori nama (string), cari/buat di database
    if (kategori_nama && !id_kategori) {
      const [existingKategori] = await db.query(
        "SELECT id_kategori FROM kategori_buku WHERE nama = ?",
        [kategori_nama]
      );

      if (existingKategori.length > 0) {
        id_kategori = existingKategori[0].id_kategori;
      } else {
        // Buat kategori baru
        const [result] = await db.query(
          "INSERT INTO kategori_buku (nama) VALUES (?)",
          [kategori_nama]
        );
        id_kategori = result.insertId;
      }
    }

    // Handle image upload
    const imageFile = formData.get("gambar");
    let imageName = "default.jpg";

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const originalName = imageFile.name.replace(/\s+/g, "_");
      imageName = `${timestamp}_${originalName}`;

      // Save to public/buku/coverbuku/
      const uploadDir = path.join(process.cwd(), "public", "buku", "coverbuku");
      const filePath = path.join(uploadDir, imageName);

      await writeFile(filePath, buffer);
      console.log("✅ Image uploaded:", imageName);
    }

    // Insert into database
    const dibuat_pada = new Date();
    const [result] = await db.query(
      `INSERT INTO buku 
      (isbn, judul, deskripsi, penulis, penerbit, total_halaman, tahun, id_kategori, stok, id_rak, dibuat_pada, gambar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
        imageName,
      ]
    );

    return NextResponse.json({
      message: "Buku berhasil ditambahkan",
      id_buku: result.insertId,
      gambar: imageName,
    });

  } catch (err) {
    console.error("❌ BUKU POST ERROR:", err);
    return NextResponse.json(
      { message: "Error adding book", error: err.message },
      { status: 500 }
    );
  }
}

// ==== PUT: UPDATE BOOK ====
export async function PUT(req) {
  try {
    const db = await getDb();
    const body = await req.json();
    const {
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
    } = body;

    await db.query(
      `UPDATE buku SET
        isbn = ?,
        judul = ?,
        deskripsi = ?,
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
        deskripsi,
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

    return NextResponse.json({ message: "Buku berhasil diupdate" });

  } catch (err) {
    console.error("❌ BUKU PUT ERROR:", err);
    return NextResponse.json(
      { message: "Error updating book", error: err.message },
      { status: 500 }
    );
  }
}

// ==== DELETE: DELETE BOOK ====
export async function DELETE(req) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID buku tidak ditemukan" },
        { status: 400 }
      );
    }

    await db.query("DELETE FROM buku WHERE id_buku = ?", [id]);
    
    return NextResponse.json({ message: "Buku berhasil dihapus" });

  } catch (err) {
    console.error("❌ BUKU DELETE ERROR:", err);
    return NextResponse.json(
      { message: "Error deleting book", error: err.message },
      { status: 500 }
    );
  }
}
