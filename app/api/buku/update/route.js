import getDb from "@/app/lib/database";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

// ==== PUT: UPDATE BOOK WITH FORMDATA (SUPPORT KATEGORI + IMAGE UPDATE) ====
export async function PUT(req) {
  try {
    const db = await getDb();
    const formData = await req.formData();

    // Extract form fields
    const id_buku = formData.get("id_buku");
    const isbn = formData.get("isbn");
    const judul = formData.get("judul");
    const penulis = formData.get("penulis");
    const penerbit = formData.get("penerbit");
    const tahun = formData.get("tahun");
    const total_halaman = formData.get("total_halaman") || 0;
    const stok = formData.get("stok");
    const deskripsi = formData.get("deskripsi") || "";
    const id_rak = formData.get("id_rak") || null;
    const gambar_lama = formData.get("gambar_lama");

    if (!id_buku) {
      return NextResponse.json(
        { message: "ID buku tidak ditemukan" },
        { status: 400 }
      );
    }

    // Handle kategori
    let id_kategori = formData.get("id_kategori");
    const kategori_nama = formData.get("kategori");

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

    // Handle image update
    const imageFile = formData.get("gambar");
    let imageName = gambar_lama; // Default tetap pakai gambar lama

    // Jika ada file gambar baru yang diupload
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
      console.log("✅ New image uploaded:", imageName);
    }

    // Update database
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
        id_rak = ?,
        gambar = ?
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
        imageName,
        id_buku,
      ]
    );

    return NextResponse.json({
      message: "Buku berhasil diupdate",
      gambar: imageName,
    });

  } catch (err) {
    console.error("❌ BUKU UPDATE ERROR:", err);
    return NextResponse.json(
      { message: "Error updating book", error: err.message },
      { status: 500 }
    );
  }
}