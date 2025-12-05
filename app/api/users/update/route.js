import getDb from "@/app/lib/database";
import jwt from "jsonwebtoken";

export async function PUT(req) {
  try {
    // Ambil cookie manual (karena Edge runtime)
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find(c => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return Response.json(
        { message: "Token tidak ditemukan" },
        { status: 401 }
      );
    }

    // Verifikasi token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return Response.json(
        { message: "Token invalid atau expired" },
        { status: 401 }
      );
    }

    const id_users = decoded.id_users;
    const { username, email } = await req.json();
    const db = await getDb();

    await db.query(
      "UPDATE users SET username = ?, email = ? WHERE id_users = ?",
      [username, email, id_users]
    );

    const [rows] = await db.query(
      "SELECT id_users, username, email, role FROM users WHERE id_users = ?",
      [id_users]
    );

    return Response.json(
      {
        message: "Profile berhasil diperbarui",
        user: rows[0],
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
