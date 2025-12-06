import getDb from "@/app/lib/database";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();
    const db = await getDb();

    // cek user exist
    const [check] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (check.length > 0) {
      return Response.json(
        { message: "Email sudah digunakan" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    // default role: user
    await db.query(
      "INSERT INTO users(username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashed, "user"]
    );

    return Response.json({ message: "Registrasi berhasil" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}