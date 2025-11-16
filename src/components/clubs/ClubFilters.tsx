"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const categories = [
  "All",
  "Technology",
  "Arts",
  "Academic",
  "Sports",
  "Cultural",
  "Professional",
  "Social",
];

interface ClubFiltersProps {
  onFilterChange?: (category: string) => void;
}

export default function ClubFilters({ onFilterChange }: ClubFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    if (onFilterChange) {
      onFilterChange(category === "All" ? "" : category);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={category === selectedCategory ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}