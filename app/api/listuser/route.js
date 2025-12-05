import { NextResponse } from "next/server";
import getDb from "@/app/lib/database";

// ==== GET: AMBIL SEMUA USERS ====
export async function GET(req) {
  try {
    const db = await getDb();

    const [rows] = await db.query(`
      SELECT 
        id_users,
        username,
        email,
        role
      FROM users
      ORDER BY id_users DESC
    `);

    return NextResponse.json(rows);

  } catch (error) {
    console.error("❌ GET USERS ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}