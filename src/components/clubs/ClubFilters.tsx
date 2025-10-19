"use client";

import { Button } from "@/components/ui/button";

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

export default function ClubFilters() {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={category === "All" ? "default" : "outline"}
          size="sm"
          onClick={() => console.log(`Filter: ${category}`)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}