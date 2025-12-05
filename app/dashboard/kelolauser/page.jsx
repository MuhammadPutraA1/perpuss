"use client";

import { useEffect, useState } from "react";

export default function KelolaUserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/listakun");
      const data = await res.json();

      console.log("HASIL DARI API /api/listakun:", data); // DEBUG

      // Jika API mengembalikan object error → jangan set array
      if (!Array.isArray(data)) {
        console.error("API tidak mengembalikan array!");
        setUsers([]); 
      } else {
        setUsers(data);
      }

    } catch (err) {
      console.error("Gagal fetch:", err);
      setUsers([]); 
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Kelola User</h1>

      <div className="bg-white rounded shadow p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  Tidak ada user atau API tidak mengembalikan data.
                </td>
              </tr>
            )}

            {Array.isArray(users) &&
              users.map((u) => (
                <tr key={u.id_users}>
                  <td className="p-2 border">{u.id_users}</td>
                  <td className="p-2 border">{u.username}</td>
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border capitalize">{u.role}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
