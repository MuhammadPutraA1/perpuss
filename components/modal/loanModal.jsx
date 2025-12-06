"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function LoanModal({ bookId, user, bookTitle, onSuccess }) {
  const [tanggalPinjam, setTanggalPinjam] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("Anda harus login terlebih dahulu");
      return;
    }

    setLoading(true);

    fetch("/api/peminjaman", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_users: user.id_users,
        id_buku: bookId,
        tanggal_pinjam: tanggalPinjam || undefined,
        tanggal_kembali: tanggalKembali || undefined,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Gagal memproses peminjaman");
        }
        alert(data.message);
        setOpen(false);
        setTanggalPinjam("");
        setTanggalKembali("");
        onSuccess?.(data);
      })
      .catch((err) => {
        console.error("Loan submit error:", err);
        alert(err.message || "Terjadi kesalahan");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Request Pinjam</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Peminjaman Buku</DialogTitle>
          {bookTitle && <p className="text-sm text-gray-500">{bookTitle}</p>}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tanggal Pinjam */}
          <div className="flex flex-col space-y-1">
            <Label>Tanggal Pinjam</Label>
            <Input
              type="date"
              value={tanggalPinjam}
              onChange={(e) => setTanggalPinjam(e.target.value)}
              required
            />
          </div>

          {/* Tanggal Kembali */}
          <div className="flex flex-col space-y-1">
            <Label>Tanggal Kembali</Label>
            <Input
              type="date"
              value={tanggalKembali}
              onChange={(e) => setTanggalKembali(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Konfirmasi Peminjaman"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
