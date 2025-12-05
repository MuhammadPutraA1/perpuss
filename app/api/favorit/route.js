import { NextResponse } from "next/server";
import getDb from "@/app/lib/database";

// POST → tambah ke favorit
export async function POST(req) {
  try {
    const { id_users, id_buku } = await req.json();

    if (!id_users || !id_buku) {
      return NextResponse.json(
        { message: "Data kurang" },
        { status: 400 }
      );
    }

    const db = await getDb();

    await db.query(
      `INSERT INTO favorit (id_users, id_buku) VALUES (?, ?)`,
      [id_users, id_buku]
    );

    return NextResponse.json(
      { message: "Berhasil ditambahkan ke favorit" },
      { status: 201 }
    );

  } catch (err) {
    console.error("FAVORIT POST ERROR:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

// GET → ambil semua favorit user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id_users = searchParams.get("user");

    const db = await getDb();

    const [rows] = await db.query(
      `SELECT f.id_favorit, b.* 
       FROM favorit f
       JOIN buku b ON b.id_buku = f.id_buku
       WHERE f.id_users = ?`,
      [id_users]
    );

    return NextResponse.json(rows, { status: 200 });

  } catch (err) {
    console.error("FAVORIT GET ERROR:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}


// DELETE → hapus dari favorit
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id_users = searchParams.get("user");
    const id_buku = searchParams.get("id_buku");

    if (!id_users || !id_buku) {
      return NextResponse.json(
        { message: "Data kurang" },
        { status: 400 }
      );
    }

    const db = await getDb();

    await db.query(
      `DELETE FROM favorit WHERE id_users = ? AND id_buku = ?`,
      [id_users, id_buku]
    );

    return NextResponse.json(
      { message: "Berhasil dihapus dari favorit" },
      { status: 200 }
    );

  } catch (err) {
    console.error("FAVORIT DELETE ERROR:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
