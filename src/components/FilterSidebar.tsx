
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, Tag } from "@/types";
import { Slider } from "@/components/ui/slider";
import { Star } from "lucide-react";

interface FilterSidebarProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  availableTags: Tag[];
}

const FilterSidebar = ({
  filter,
  onFilterChange,
  availableTags,
}: FilterSidebarProps) => {
  const handleRatingChange = (value: number[]) => {
    onFilterChange({
      ...filter,
      rating: value[0] || null,
    });
  };

  const handleTagToggle = (tagId: string) => {
    const updatedTags = filter.tags.includes(tagId)
      ? filter.tags.filter((id) => id !== tagId)
      : [...filter.tags, tagId];

    onFilterChange({
      ...filter,
      tags: updatedTags,
    });
  };

  return (
    <aside className="w-60 flex-shrink-0 h-screen overflow-y-auto bg-sidebar p-4">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Catatan</h3>
          <div className="space-y-1">
            <button className="w-full text-left px-2 py-1 rounded hover:bg-gray-700 transition-colors">
              Catatan
            </button>
            <button className="w-full text-left px-2 py-1 rounded hover:bg-gray-700 transition-colors">
              Pengingat
            </button>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-2">Rating</h3>
          <div className="px-2">
            <div className="flex items-center justify-between mb-2">
              <span>Minimal Rating:</span>
              <div className="flex items-center">
                {filter.rating || 0} <Star className="ml-1 w-4 h-4" />
              </div>
            </div>
            <Slider
              defaultValue={[filter.rating || 0]}
              max={5}
              step={1}
              onValueChange={handleRatingChange}
              className="mt-2"
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-2">Tags</h3>
          <div className="space-y-2">
            {availableTags.map((tag) => (
              <div key={tag.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag.id}`}
                  checked={filter.tags.includes(tag.id)}
                  onCheckedChange={() => handleTagToggle(tag.id)}
                />
                <Label htmlFor={`tag-${tag.id}`} className="cursor-pointer">
                  {tag.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
