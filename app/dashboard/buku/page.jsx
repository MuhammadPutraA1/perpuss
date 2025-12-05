"use client";

import React, { useEffect, useState } from "react";
import { Plus, X, Upload, Search, Edit2, Trash2 } from "lucide-react";

export default function DashboardBukuPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    id_buku: "",
    judul: "",
    penulis: "",
    penerbit: "",
    tahun: "",
    isbn: "",
    kategori: "",
    id_kategori: "",
    stok: "",
    total_halaman: "",
    deskripsi: "",
    id_rak: "",
    gambar_lama: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/buku");
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
      alert("Gagal memuat data buku");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (book) => {
    setEditMode(true);
    setFormData({
      id_buku: book.id_buku,
      judul: book.judul,
      penulis: book.penulis,
      penerbit: book.penerbit,
      tahun: book.tahun,
      isbn: book.isbn,
      kategori: book.kategori || "",
      id_kategori: book.id_kategori || "",
      stok: book.stok,
      total_halaman: book.total_halaman || "",
      deskripsi: book.deskripsi || "",
      id_rak: book.id_rak || "",
      gambar_lama: book.gambar || "",
    });
    setImagePreview(`/buku/coverbuku/${book.gambar}`);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editMode) {
        // UPDATE MODE - Pakai FormData seperti POST supaya bisa handle kategori dengan benar
        const formDataToSend = new FormData();
        
        formDataToSend.append("id_buku", formData.id_buku);
        formDataToSend.append("isbn", formData.isbn);
        formDataToSend.append("judul", formData.judul);
        formDataToSend.append("deskripsi", formData.deskripsi);
        formDataToSend.append("penulis", formData.penulis);
        formDataToSend.append("penerbit", formData.penerbit);
        formDataToSend.append("total_halaman", formData.total_halaman || 0);
        formDataToSend.append("tahun", formData.tahun);
        formDataToSend.append("stok", formData.stok);
        
        if (formData.id_rak) {
          formDataToSend.append("id_rak", formData.id_rak);
        }
        
        // Kirim nama kategori, biar API yang handle
        if (formData.kategori) {
          formDataToSend.append("kategori", formData.kategori);
        }
        
        // Kirim gambar baru jika ada
        if (imageFile) {
          formDataToSend.append("gambar", imageFile);
        } else {
          // Kirim gambar lama supaya tidak berubah
          formDataToSend.append("gambar_lama", formData.gambar_lama);
        }

        const res = await fetch("/api/buku/update", {
          method: "PUT",
          body: formDataToSend,
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || "Gagal mengupdate buku");
        }

        alert("✅ Buku berhasil diupdate!");
        
      } else {
        // ADD MODE
        const formDataToSend = new FormData();
        
        Object.keys(formData).forEach((key) => {
          if (formData[key] && key !== 'id_buku' && key !== 'gambar_lama') {
            formDataToSend.append(key, formData[key]);
          }
        });

        if (imageFile) {
          formDataToSend.append("gambar", imageFile);
        }

        const res = await fetch("/api/buku", {
          method: "POST",
          body: formDataToSend,
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || "Gagal menambah buku");
        }

        alert("✅ Buku berhasil ditambahkan!");
      }

      setShowModal(false);
      resetForm();
      fetchBooks();

    } catch (error) {
      console.error("Error saving book:", error);
      alert("❌ " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id_buku, judul) => {
    if (!confirm(`Hapus buku "${judul}"?`)) return;

    try {
      const res = await fetch(`/api/buku?id=${id_buku}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus buku");

      alert("✅ Buku berhasil dihapus");
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("❌ " + error.message);
    }
  };

  const resetForm = () => {
    setEditMode(false);
    setFormData({
      id_buku: "",
      judul: "",
      penulis: "",
      penerbit: "",
      tahun: "",
      isbn: "",
      kategori: "",
      id_kategori: "",
      stok: "",
      total_halaman: "",
      deskripsi: "",
      id_rak: "",
      gambar_lama: "",
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const filteredBooks = books.filter((book) =>
    book.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.penulis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.kategori?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kelola Buku</h1>
        <button
          onClick={() => {
            setEditMode(false);
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Tambah Buku
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari buku berdasarkan judul, penulis, atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-5">
        <h2 className="text-lg font-semibold mb-4">📚 Daftar Buku ({filteredBooks.length})</h2>

        {loading ? (
          <p className="text-gray-500 text-center py-8">Loading...</p>
        ) : filteredBooks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {searchQuery ? "Tidak ada buku yang sesuai pencarian" : "Belum ada buku"}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-600 bg-gray-50">
                  <th className="py-3 px-2">Cover</th>
                  <th className="py-3 px-2">Judul & Penulis</th>
                  <th className="py-3 px-2">Kategori</th>
                  <th className="py-3 px-2">Penerbit</th>
                  <th className="py-3 px-2">Tahun</th>
                  <th className="py-3 px-2">Stok</th>
                  <th className="py-3 px-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id_buku} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <img
                        src={`/buku/coverbuku/${book.gambar || 'default.jpg'}`}
                        alt={book.judul}
                        className="w-12 h-16 object-cover rounded shadow-sm"
                        onError={(e) => {
                          e.target.src = '/buku/coverbuku/default.jpg';
                        }}
                      />
                    </td>
                    <td className="py-3 px-2">
                      <p className="font-medium text-gray-800">{book.judul}</p>
                      <p className="text-xs text-gray-500">{book.penulis}</p>
                    </td>
                    <td className="py-3 px-2">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {book.kategori || "Uncategorized"}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-700">{book.penerbit}</td>
                    <td className="py-3 px-2 text-gray-700">{book.tahun}</td>
                    <td className="py-3 px-2">
                      <span className={`font-semibold ${book.stok > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {book.stok}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800" 
                          title="Edit"
                          onClick={() => handleEdit(book)}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800" 
                          title="Hapus"
                          onClick={() => handleDelete(book.id_buku, book.judul)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold">
                {editMode ? "Edit Buku" : "Tambah Buku Baru"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Buku {editMode && <span className="text-xs text-gray-500">(biarkan kosong jika tidak ingin mengubah)</span>}
                  </label>
                  <div className="flex items-center gap-4">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-32 object-cover rounded shadow"
                      />
                    ) : (
                      <div className="w-24 h-32 bg-gray-100 rounded flex items-center justify-center">
                        <Upload className="text-gray-400" size={32} />
                      </div>
                    )}
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <span className="text-sm text-gray-700">
                        {editMode ? "Ganti Gambar" : "Pilih Gambar"}
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Buku *
                  </label>
                  <input
                    type="text"
                    name="judul"
                    value={formData.judul}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Penulis *
                  </label>
                  <input
                    type="text"
                    name="penulis"
                    value={formData.penulis}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Penerbit *
                    </label>
                    <input
                      type="text"
                      name="penerbit"
                      value={formData.penerbit}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tahun Terbit *
                    </label>
                    <input
                      type="number"
                      name="tahun"
                      value={formData.tahun}
                      onChange={handleChange}
                      required
                      min="1900"
                      max="2100"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ISBN *
                    </label>
                    <input
                      type="text"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori *
                    </label>
                    <input
                      type="text"
                      name="kategori"
                      value={formData.kategori}
                      onChange={handleChange}
                      required
                      placeholder="Fiksi, Non-Fiksi, dll"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jumlah Stok *
                    </label>
                    <input
                      type="number"
                      name="stok"
                      value={formData.stok}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Halaman
                    </label>
                    <input
                      type="number"
                      name="total_halaman"
                      value={formData.total_halaman}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Rak (opsional)
                  </label>
                  <input
                    type="number"
                    name="id_rak"
                    value={formData.id_rak}
                    onChange={handleChange}
                    placeholder="Contoh: 1"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Sinopsis atau deskripsi buku..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {submitting ? "Menyimpan..." : editMode ? "Update Buku" : "Simpan Buku"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}