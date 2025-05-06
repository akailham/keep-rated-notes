
export type Category = 
  | "all"
  | "comic"
  | "game"
  | "anime"
  | "series"
  | "film"
  | "others"
  | "notes";

export interface Tag {
  id: string;
  name: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  url?: string;
  imageUrl?: string;
  category: Category;
  rating: 1 | 2 | 3 | 4 | 5;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface Filter {
  searchTerm: string;
  category: Category;
  rating: number | null;
  tags: string[];
}
