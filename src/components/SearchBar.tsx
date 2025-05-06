
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddNote: () => void;
}

const SearchBar = ({ searchTerm, onSearchChange, onAddNote }: SearchBarProps) => {
  return (
    <div className="flex items-center justify-center max-w-3xl mx-auto p-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Buat catatan..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-secondary border-gray-700 w-full"
        />
      </div>
      <Button
        onClick={onAddNote}
        className="ml-2 px-3"
        size="icon"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default SearchBar;
