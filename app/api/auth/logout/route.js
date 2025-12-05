import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({
    message: "Logged out",
    success: true,
  });

  // Hapus cookie token dengan aman
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",          // WAJIB: biar token kehapus di semua route
    expires: new Date(0), // Tanggal kadaluarsa 1970 → auto delete
  });

  return res;
}
