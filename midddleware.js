import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("token")?.value || null;
  const url = req.nextUrl.pathname;

  // Jika user masuk halaman yang dilindungi tapi tidak ada token
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // Token rusak atau expired → paksa login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // =========================
  //        ROLE ADMIN
  // =========================
  if (decoded.role === "admin") {
    // Admin bebas masuk kemana saja
    return NextResponse.next();
  }

  // =========================
  //         ROLE USER
  // =========================

  // user tidak boleh masuk dashboard (admin area)
  if (decoded.role === "user" && url.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

// Terapkan middleware hanya pada route tertentu
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/user/:path*",
  ],
};
