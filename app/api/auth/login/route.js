import getDb from "@/app/lib/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const db = await getDb();

    // CARI EMAIL
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return Response.json(
        { message: "Email tidak ditemukan" },
        { status: 400 }
      );
    }

    const user = rows[0];

    // CEK PASSWORD
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return Response.json(
        { message: "Password salah" },
        { status: 400 }
      );
    }

    // BUAT TOKEN JWT
    const token = jwt.sign(
      {
        id_users: user.id_users,
        email: user.email,
        role: user.role,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // KIRIM DATA USER
    return Response.json(
      {
        message: "Login berhasil",
        token,
        user: {
          id_users: user.id_users,
          username: user.username,
          email: user.email,
          role: user.role,
          jenis_kelamin: user.jenis_kelamin
        }
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
