import { NextResponse } from "next/server";
import getDb from "@/app/lib/database";

// ==== POST: USER REQUEST PINJAM BUKU ====
export async function POST(req) {
  try {
    const db = await getDb();
    const { id_users, id_buku } = await req.json();

    console.log("========== PEMINJAMAN REQUEST ==========");
    console.log("👤 User ID:", id_users);
    console.log("📚 Book ID:", id_buku);

    // === 1. CEK BUKU ADA & STOK ===
    const [bukuRows] = await db.query(
      "SELECT judul, stok FROM buku WHERE id_buku = ?",
      [id_buku]
    );

    if (bukuRows.length === 0) {
      return NextResponse.json(
        { message: "Buku tidak ditemukan" },
        { status: 404 }
      );
    }

    const buku = bukuRows[0];
    console.log("📖 Buku:", buku.judul);
    console.log("📦 Stok saat ini:", buku.stok);

    if (buku.stok <= 0) {
      return NextResponse.json(
        { message: "Stok buku habis, tidak bisa request peminjaman" },
        { status: 400 }
      );
    }

    // === 2. CEK APAKAH USER SUDAH PUNYA REQUEST TERTUNDA ATAU SEDANG PINJAM BUKU INI ===
    const [existingPinjam] = await db.query(
      `SELECT id_peminjaman, status FROM peminjaman 
       WHERE id_users = ? AND id_book = ? 
       AND status IN ('tertunda', 'diterima')`,
      [id_users, id_buku]
    );

    if (existingPinjam.length > 0) {
      const statusMsg = existingPinjam[0].status === 'tertunda' 
        ? "Anda sudah memiliki request peminjaman yang menunggu approval"
        : "Anda masih meminjam buku ini";
      
      return NextResponse.json(
        { message: statusMsg },
        { status: 400 }
      );
    }

    // === 3. HITUNG TANGGAL (estimasi) ===
    const tanggalPinjam = new Date();
    const tanggalKembali = new Date();
    tanggalKembali.setDate(tanggalKembali.getDate() + 7); // 7 hari dari sekarang

    const formatTanggal = (date) => {
      return date.toISOString().split("T")[0];
    };

    console.log("📅 Tanggal Request:", formatTanggal(tanggalPinjam));
    console.log("📅 Estimasi Kembali:", formatTanggal(tanggalKembali));

    // === 4. INSERT PEMINJAMAN DENGAN STATUS TERTUNDA ===
    const [insertResult] = await db.query(
      `INSERT INTO peminjaman 
       (id_users, id_book, tanggal_peminjaman, tanggal_pengembalian, status) 
       VALUES (?, ?, ?, ?, 'tertunda')`,
      [id_users, id_buku, formatTanggal(tanggalPinjam), formatTanggal(tanggalKembali)]
    );

    console.log("✅ Request peminjaman berhasil, ID:", insertResult.insertId);
    console.log("⏳ Status: tertunda (menunggu approval admin)");
    console.log("======================================\n");

    return NextResponse.json({
      message: "Request peminjaman berhasil! Menunggu approval admin.",
      data: {
        id_peminjaman: insertResult.insertId,
        judul: buku.judul,
        status: "tertunda",
        tanggal_request: formatTanggal(tanggalPinjam),
        estimasi_kembali: formatTanggal(tanggalKembali),
      },
    });

  } catch (error) {
    console.error("❌ PEMINJAMAN REQUEST ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: error.message },
      { status: 500 }
    );
  }
}

// ==== GET: AMBIL HISTORY PEMINJAMAN USER ====
export async function GET(req) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);
    const id_users = searchParams.get("user");
    const status = searchParams.get("status"); // optional filter

    if (!id_users) {
      return NextResponse.json(
        { message: "User ID required" },
        { status: 400 }
      );
    }

    let query = `
      SELECT 
        p.id_peminjaman,
        p.id_book,
        p.tanggal_peminjaman,
        p.tanggal_pengembalian,
        p.pengembalian,
        p.status,
        b.judul,
        b.penulis,
        b.gambar
      FROM peminjaman p
      JOIN buku b ON p.id_book = b.id_buku
      WHERE p.id_users = ?
    `;

    const params = [id_users];

    if (status) {
      query += " AND p.status = ?";
      params.push(status);
    }

    query += " ORDER BY p.tanggal_peminjaman DESC";

    const [rows] = await db.query(query, params);

    return NextResponse.json(rows);

  } catch (error) {
    console.error("❌ GET PEMINJAMAN ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}