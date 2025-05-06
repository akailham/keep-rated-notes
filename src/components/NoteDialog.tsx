
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category, Note, Tag } from "@/types";
import { getCategoryName } from "@/utils/localStorageUtils";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Star } from "lucide-react";
import { toast } from "sonner";

interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note?: Note;
  onSave: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  availableTags: Tag[];
  onAddTag: (name: string) => Tag;
}

const categories: Category[] = [
  "comic",
  "game",
  "anime",
  "series",
  "film",
  "others",
  "notes",
];

const NoteDialog = ({
  open,
  onOpenChange,
  note,
  onSave,
  availableTags,
  onAddTag,
}: NoteDialogProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState<Category>("notes");
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [newTagInput, setNewTagInput] = useState("");

  // Reset form when opened or note changes
  useEffect(() => {
    if (open) {
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setUrl(note.url || "");
        setImageUrl(note.imageUrl || "");
        setCategory(note.category);
        setRating(note.rating);
        setSelectedTags(note.tags);
      } else {
        setTitle("");
        setContent("");
        setUrl("");
        setImageUrl("");
        setCategory("notes");
        setRating(5);
        setSelectedTags([]);
      }
      setNewTagInput("");
    }
  }, [open, note]);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    onSave({
      title,
      content,
      url: url || undefined,
      imageUrl: imageUrl || undefined,
      category,
      rating,
      tags: selectedTags,
    });

    onOpenChange(false);
  };

  const handleAddTag = () => {
    if (newTagInput.trim()) {
      const newTag = onAddTag(newTagInput.trim());
      if (!selectedTags.some(tag => tag.id === newTag.id)) {
        setSelectedTags([...selectedTags, newTag]);
      }
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
  };

  const handleSelectExistingTag = (tagId: string) => {
    const tag = availableTags.find(tag => tag.id === tagId);
    if (tag && !selectedTags.some(t => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground border-gray-800">
        <DialogHeader>
          <DialogTitle>
            {note ? "Edit Note" : "Create New Note"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              className="bg-secondary border-gray-700"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Note content"
              className="min-h-[100px] bg-secondary border-gray-700"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="url">URL (optional)</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="bg-secondary border-gray-700"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="bg-secondary border-gray-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as Category)}
              >
                <SelectTrigger id="category" className="bg-secondary border-gray-700">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-gray-700">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {getCategoryName(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rating">Rating</Label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value as 1 | 2 | 3 | 4 | 5)}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        value <= rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-500"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-1 mb-2">
              {selectedTags.map((tag) => (
                <Badge 
                  key={tag.id} 
                  variant="secondary"
                  className="bg-gray-700 hover:bg-gray-600 flex items-center gap-1"
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag.id)}
                    className="ml-1 text-gray-400 hover:text-gray-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                placeholder="Add new tag"
                className="bg-secondary border-gray-700 flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                onClick={handleAddTag}
                className="border-gray-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Select
              onValueChange={handleSelectExistingTag}
              value=""
            >
              <SelectTrigger className="bg-secondary border-gray-700 mt-2">
                <SelectValue placeholder="Select existing tag" />
              </SelectTrigger>
              <SelectContent className="bg-secondary border-gray-700">
                {availableTags
                  .filter((tag) => !selectedTags.some((t) => t.id === tag.id))
                  .map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-700">
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDialog;
