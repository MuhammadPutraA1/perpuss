import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import getDb from "@/app/lib/database";

export async function POST(req) {
  try {
    const db = await getDb();
    const { email, password } = await req.json();

    // 🔍 DEBUG: Cek JWT_SECRET
    console.log("========== LOGIN DEBUG ==========");
    console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET);
    console.log("🔑 Length:", process.env.JWT_SECRET?.length);
    console.log("🔑 Type:", typeof process.env.JWT_SECRET);
    console.log("📧 Email attempting login:", email);

    const [rows] = await db.query(
      "SELECT id_users AS id, username, email, password, role FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      console.log(" Email tidak ditemukan");
      return NextResponse.json(
        { message: "Email tidak ditemukan" },
        { status: 401 }
      );
    }

    const user = rows[0];
    console.log("👤 User found:", { id: user.id, email: user.email, role: user.role });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log(" Password salah");
      return NextResponse.json(
        { message: "Password salah" },
        { status: 401 }
      );
    }

    console.log("✅ Password valid");

    // Generate token
    const token = jwt.sign(
      {
        id_users: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ Token generated successfully");
    console.log("🎫 Token preview:", token.substring(0, 30) + "...");

    const response = NextResponse.json({
      message: "Login berhasil",
      user: {
        id_users: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;

  } catch (error) {
    console.error(" LOGIN ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}