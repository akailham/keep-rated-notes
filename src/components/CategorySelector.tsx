
import { useState } from "react";
import { Category } from "@/types";
import { getCategoryName, getCategoryColor } from "@/utils/localStorageUtils";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
}

const categories: Category[] = [
  "all",
  "comic",
  "game",
  "anime",
  "series",
  "film",
  "others",
  "notes",
];

const CategorySelector = ({
  selectedCategory,
  onCategoryChange,
}: CategorySelectorProps) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-2 py-4 border-b border-gray-800">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
            selectedCategory === category
              ? `${getCategoryColor(category)} text-white`
              : "bg-secondary text-gray-400 hover:bg-gray-800"
          )}
        >
          <div className={cn(
            "w-3 h-3 rounded-full",
            getCategoryColor(category)
          )} />
          <span>{getCategoryName(category)}</span>
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
