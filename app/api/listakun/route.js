import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import getDb from "@/app/lib/database";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // WAJIB: panggil database pool
    const db = await getDb();

    const [users] = await db.query(
      `SELECT id_users,username , email, role
       FROM users
       WHERE LOWER(role) != 'admin'
       ORDER BY id_users ASC`
    );

    return NextResponse.json(users);  // ← INI ARRAY
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
