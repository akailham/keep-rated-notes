
import { Category, Note, Tag } from "@/types";

// Local storage keys
const NOTES_STORAGE_KEY = "keep-rated-notes";
const TAGS_STORAGE_KEY = "keep-rated-tags";

// Initial tags
const initialTags: Tag[] = [
  { id: "1", name: "Action" },
  { id: "2", name: "Adventure" },
  { id: "3", name: "Comedy" },
  { id: "4", name: "Drama" },
  { id: "5", name: "Horror" },
  { id: "6", name: "Fantasy" },
  { id: "7", name: "Sci-Fi" },
  { id: "8", name: "Romance" },
  { id: "9", name: "Documentary" },
  { id: "10", name: "Mystery" },
];

// Sample notes data
const sampleNotes: Note[] = [
  {
    id: "1",
    title: "Tensei Shitara Slime Datta Ken",
    content: "Great isekai anime about a slime that can mimic abilities.",
    url: "https://example.com/tensei-slime",
    imageUrl: "https://source.unsplash.com/random/300x200?anime",
    category: "anime",
    rating: 5,
    tags: [
      { id: "2", name: "Adventure" },
      { id: "6", name: "Fantasy" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Omniscient Reader",
    content: "A web novel reader becomes part of the story he's reading.",
    url: "https://example.com/omniscient-reader",
    imageUrl: "https://source.unsplash.com/random/300x200?book",
    category: "comic",
    rating: 5,
    tags: [
      { id: "1", name: "Action" },
      { id: "2", name: "Adventure" },
      { id: "6", name: "Fantasy" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Visual Studio Code",
    content: "The best code editor for web development.",
    url: "https://code.visualstudio.com",
    category: "others",
    rating: 4,
    tags: [
      { id: "11", name: "Productivity" },
      { id: "12", name: "Development" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Get all notes from local storage
export const getNotes = (): Note[] => {
  const notes = localStorage.getItem(NOTES_STORAGE_KEY);
  if (!notes) {
    // Initialize with sample notes
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(sampleNotes));
    return sampleNotes;
  }
  return JSON.parse(notes);
};

// Save notes to local storage
export const saveNotes = (notes: Note[]): void => {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
};

// Get all tags from local storage
export const getTags = (): Tag[] => {
  const tags = localStorage.getItem(TAGS_STORAGE_KEY);
  if (!tags) {
    // Initialize with sample tags
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(initialTags));
    return initialTags;
  }
  return JSON.parse(tags);
};

// Save tags to local storage
export const saveTags = (tags: Tag[]): void => {
  localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
};

// Add a new note
export const addNote = (note: Omit<Note, "id" | "createdAt" | "updatedAt">): Note => {
  const notes = getNotes();
  const newNote: Note = {
    ...note,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  notes.push(newNote);
  saveNotes(notes);
  return newNote;
};

// Update an existing note
export const updateNote = (note: Note): Note => {
  const notes = getNotes();
  const index = notes.findIndex((n) => n.id === note.id);
  if (index !== -1) {
    const updatedNote = {
      ...note,
      updatedAt: new Date().toISOString(),
    };
    notes[index] = updatedNote;
    saveNotes(notes);
    return updatedNote;
  }
  return note;
};

// Delete a note
export const deleteNote = (id: string): void => {
  const notes = getNotes();
  const updatedNotes = notes.filter((note) => note.id !== id);
  saveNotes(updatedNotes);
};

// Add a new tag
export const addTag = (name: string): Tag => {
  const tags = getTags();
  const existingTag = tags.find((tag) => tag.name.toLowerCase() === name.toLowerCase());
  
  if (existingTag) {
    return existingTag;
  }
  
  const newTag: Tag = {
    id: Date.now().toString(),
    name,
  };
  tags.push(newTag);
  saveTags(tags);
  return newTag;
};

// Delete a tag
export const deleteTag = (id: string): void => {
  const tags = getTags();
  const updatedTags = tags.filter((tag) => tag.id !== id);
  saveTags(updatedTags);
  
  // Also remove this tag from all notes
  const notes = getNotes();
  const updatedNotes = notes.map((note) => ({
    ...note,
    tags: note.tags.filter((tag) => tag.id !== id),
  }));
  saveNotes(updatedNotes);
};

// Filter notes
export const filterNotes = (
  notes: Note[],
  filter: {
    searchTerm?: string;
    category?: Category;
    rating?: number | null;
    tags?: string[];
  }
): Note[] => {
  return notes.filter((note) => {
    // Filter by search term
    if (
      filter.searchTerm &&
      !note.title.toLowerCase().includes(filter.searchTerm.toLowerCase()) &&
      !note.content.toLowerCase().includes(filter.searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filter by category
    if (filter.category && filter.category !== "all" && note.category !== filter.category) {
      return false;
    }

    // Filter by rating
    if (filter.rating && note.rating < filter.rating) {
      return false;
    }

    // Filter by tags
    if (filter.tags && filter.tags.length > 0) {
      const noteTagIds = note.tags.map((tag) => tag.id);
      const hasAllTags = filter.tags.every((tagId) => noteTagIds.includes(tagId));
      if (!hasAllTags) {
        return false;
      }
    }

    return true;
  });
};

// Get category display name
export const getCategoryName = (category: Category): string => {
  const categoryNames: Record<Category, string> = {
    all: "Semua",
    comic: "Komik",
    game: "Game",
    anime: "Anime",
    series: "Film Series",
    film: "Film",
    others: "Dan Lain-Lain",
    notes: "Catatan",
  };
  
  return categoryNames[category] || category;
};

// Get category color
export const getCategoryColor = (category: Category): string => {
  const categoryColors: Record<Category, string> = {
    all: "bg-category-all",
    comic: "bg-category-comic",
    game: "bg-category-game",
    anime: "bg-category-anime",
    series: "bg-category-series",
    film: "bg-category-film",
    others: "bg-category-others",
    notes: "bg-category-notes",
  };
  
  return categoryColors[category] || "bg-gray-500";
};
