
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import CategorySelector from "@/components/CategorySelector";
import FilterSidebar from "@/components/FilterSidebar";
import NoteCard from "@/components/NoteCard";
import NoteDialog from "@/components/NoteDialog";
import SearchBar from "@/components/SearchBar";
import { Category, Note, Tag, Filter } from "@/types";
import {
  getNotes,
  getTags,
  addNote,
  updateNote,
  deleteNote,
  addTag,
  filterNotes,
} from "@/utils/localStorageUtils";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";

const IndexPage = () => {
  const isMobile = useIsMobile();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [filter, setFilter] = useState<Filter>({
    searchTerm: "",
    category: "all",
    rating: null,
    tags: [],
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);

  // Load notes and tags from local storage
  useEffect(() => {
    const loadData = () => {
      try {
        const storedNotes = getNotes();
        const storedTags = getTags();
        setNotes(storedNotes);
        setTags(storedTags);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data");
      }
    };

    loadData();
  }, []);

  // Apply filters whenever notes or filter changes
  useEffect(() => {
    const filtered = filterNotes(notes, filter);
    setFilteredNotes(filtered);
  }, [notes, filter]);

  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter);
  };

  const handleAddNote = (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newNote = addNote(note);
      setNotes([newNote, ...notes]);
      toast.success("Note added successfully");
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
    }
  };

  const handleUpdateNote = (note: Note) => {
    try {
      const updatedNote = updateNote(note);
      setNotes(notes.map((n) => (n.id === note.id ? updatedNote : n)));
      toast.success("Note updated successfully");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    }
  };

  const handleDeleteNote = (id: string) => {
    try {
      deleteNote(id);
      setNotes(notes.filter((n) => n.id !== id));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleAddTag = (name: string): Tag => {
    try {
      const newTag = addTag(name);
      setTags([...tags, newTag]);
      return newTag;
    } catch (error) {
      console.error("Error adding tag:", error);
      toast.error("Failed to add tag");
      return { id: Date.now().toString(), name };
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsCreateDialogOpen(true);
  };

  const handleSaveNote = (noteData: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    if (editingNote) {
      handleUpdateNote({
        ...editingNote,
        ...noteData,
      });
    } else {
      handleAddNote(noteData);
    }
    setEditingNote(undefined);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {!isMobile && (
          <FilterSidebar
            filter={filter}
            onFilterChange={handleFilterChange}
            availableTags={tags}
          />
        )}

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="sticky top-0 z-10 bg-background">
            <div className="py-2 px-4 flex items-center">
              {isMobile && (
                <SidebarTrigger>
                  <Button variant="outline" size="sm" className="mr-2">
                    Filters
                  </Button>
                </SidebarTrigger>
              )}
              <h1 className="text-2xl font-bold flex-1 text-center">Keep Rated Notes</h1>
            </div>
            
            <CategorySelector
              selectedCategory={filter.category}
              onCategoryChange={(category) =>
                setFilter({ ...filter, category })
              }
            />
            
            <SearchBar
              searchTerm={filter.searchTerm}
              onSearchChange={(searchTerm) =>
                setFilter({ ...filter, searchTerm })
              }
              onAddNote={() => {
                setEditingNote(undefined);
                setIsCreateDialogOpen(true);
              }}
            />
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="masonry-grid animate-fade-in">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <h3 className="text-xl font-medium text-gray-400">No notes found</h3>
                  <p className="text-gray-500 mt-2">
                    {notes.length > 0
                      ? "Try adjusting your filters"
                      : "Create your first note to get started"}
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setEditingNote(undefined);
                      setIsCreateDialogOpen(true);
                    }}
                  >
                    Create Note
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {isMobile && (
          <Sidebar className="bg-sidebar border-gray-800 w-80">
            <SidebarContent>
              <FilterSidebar
                filter={filter}
                onFilterChange={handleFilterChange}
                availableTags={tags}
              />
            </SidebarContent>
          </Sidebar>
        )}

        <NoteDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          note={editingNote}
          onSave={handleSaveNote}
          availableTags={tags}
          onAddTag={handleAddTag}
        />
      </div>
    </SidebarProvider>
  );
};

export default IndexPage;
