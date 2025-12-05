import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const path = req.nextUrl.pathname;

  // IZINKAN ROUTE YANG TIDAK BOLEH DI-BLOK
  if (
    path === "/login" ||
    path === "/register" ||
    path.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }



  let decoded;
  try {
    // ✅ Gunakan jose (Edge Runtime compatible)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    decoded = payload;
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ADMIN ONLY
  if (path.startsWith("/dashboard") && decoded.role !== "admin") {
    return NextResponse.redirect(new URL("/forbidden", req.url));
  }

  // USER ONLY
  if (path.startsWith("/user") && decoded.role !== "user") {
    return NextResponse.redirect(new URL("/forbidden", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/user/:path*",
  ],
};