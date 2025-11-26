"use client";

import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CategoryPage() {
  const categories = [
    "Fiction",
    "Science",
    "Technology",
    "History",
    "Education",
    "Novel",
    "Fantasy",
    "Biography",
    "Mystery",
    "Religion",
  ]; 

  return (
    <div className="w-full h-full">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-800">Reccomended Categories</h1>

        <div className="flex items-center bg-white px-4 py-2 rounded-xl gap-2 w-full lg:w-[270px] border border-gray-300 shadow-sm">
       <Search size={18} className="text-gray-500" />
      <input className="bg-transparent outline-none text-sm w-full" placeholder="Search category..."/>
      </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Card
            key={cat}
            className="h-28 flex items-center justify-center border-2 border-dashed cursor-pointer hover:bg-teal-50 transition">
            <CardContent className="text-center font-semibold text-gray-700">{cat}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
