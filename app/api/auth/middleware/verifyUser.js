import { verifyToken } from "./verifyToken";

export function verifyUser(req) {
  const result = verifyToken(req);

  if (result.error) return result;

  if (result.decoded.role !== "user") {
    return { error: "Akses ditolak: role bukan user", status: 403 };
  }

  return { decoded: result.decoded };
}