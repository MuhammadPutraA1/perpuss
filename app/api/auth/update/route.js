import getDb from "@/app/lib/database";
import jwt from "jsonwebtoken";

export async function PUT(req) {
    try {
        // Ambil token dari Header
        const token = req.headers.get("authorization")?.split(" ")[1];

        if (!token) {
            return Response.json(
                { message: "Token tidak ditemukan" },
                { status: 401 }
            );
        }

        // Decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id_users = decoded.id_users;

        const { username, email } = await req.json();

        const db = await getDb();

        // Update user
        await db.query(
            "UPDATE users SET username = ?, email = ? WHERE id_users = ?",
            [username, email, id_users]
        );

        return Response.json(
            {
                message: "Profile berhasil diperbarui",
                user: {
                    id_users,
                    username,
                    email,
                }
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
