"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowLeft, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CategoryPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(false);

  // FETCH CATEGORIES
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/kategori");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Gagal memuat kategori");
    } finally {
      setLoading(false);
    }
  };

  // FETCH BOOKS BY CATEGORY
  const fetchBooksByCategory = async (id_kategori) => {
    setLoadingBooks(true);
    try {
      const res = await fetch(`/api/buku?kategori=${id_kategori}`);
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
      alert("Gagal memuat buku");
    } finally {
      setLoadingBooks(false);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.nama?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchBooksByCategory(category.id_kategori);
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
    setBooks([]);
  };

  const handleBookClick = (id_buku) => {
    router.push(`/user/homepage/buku/${id_buku}`);
  };

  // VIEW: DETAIL KATEGORI & BUKU
  if (selectedCategory) {
    return (
      <div className="w-full h-full">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-teal-100 p-3 rounded-lg">
            <BookOpen className="text-teal-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {selectedCategory.nama}
            </h1>
            <p className="text-sm text-gray-600">
              {books.length} buku tersedia
            </p>
          </div>
        </div>

        {loadingBooks ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading books...</p>
          </div>
        ) : books.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 text-lg">Belum ada buku di kategori ini</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {books.map((book) => (
              <Card
                key={book.id_buku}
                onClick={() => handleBookClick(book.id_buku)}
                className="hover:shadow-lg transition cursor-pointer border border-gray-200 overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={`/buku/coverbuku/${book.gambar || 'default.jpg'}`}
                      alt={book.judul}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/buku/coverbuku/default.jpg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">
                      {book.judul}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">{book.penulis}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">{book.penerbit}</p>
                      <p className="text-xs text-gray-500">{book.tahun}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // VIEW: LIST KATEGORI
  return (
    <div className="w-full h-full">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kategori Buku</h1>
          <p className="text-sm text-gray-600 mt-1">
            Jelajahi buku berdasarkan kategori
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading categories...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 text-lg">
            {searchQuery ? "Kategori tidak ditemukan" : "Belum ada kategori"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredCategories.map((cat) => (
            <Card
              key={cat.id_kategori}
              onClick={() => handleCategoryClick(cat)}
              className="h-32 flex flex-col items-center justify-center border-2 border-dashed cursor-pointer hover:bg-teal-50 hover:border-teal-400 hover:shadow-md transition group"
            >
              <CardContent className="text-center p-4">
                <div className="mb-2">
                  <BookOpen className="text-teal-600 mx-auto group-hover:scale-110 transition" size={28} />
                </div>
                <p className="font-semibold text-gray-700 group-hover:text-teal-700 transition">
                  {cat.nama}
                </p>
                {cat.total_buku !== undefined && (
                  <p className="text-xs text-gray-500 mt-1">
                    {cat.total_buku} buku
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
