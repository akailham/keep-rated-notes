
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Note } from "@/types";
import { getCategoryColor, getCategoryName } from "@/utils/localStorageUtils";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => {
  return (
    <Card className={cn(
      "note-card overflow-hidden border border-gray-800 bg-card",
      note.imageUrl ? "h-auto" : "h-auto"
    )}>
      {note.imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={note.imageUrl} 
            alt={note.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge className={cn(getCategoryColor(note.category), "text-white")}>
              {getCategoryName(note.category)}
            </Badge>
          </div>
        </div>
      )}
      
      <CardHeader className={cn(
        "p-4 pb-2",
        !note.imageUrl && "pt-4"
      )}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold line-clamp-2">{note.title}</h3>
            {!note.imageUrl && (
              <Badge className={`mt-1 ${getCategoryColor(note.category)} text-white`}>
                {getCategoryName(note.category)}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-1 bg-gray-800 px-2 py-1 rounded-full">
            <span className="font-bold">{note.rating}</span>
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <p className="text-gray-300 line-clamp-3 text-sm">{note.content}</p>
        
        {note.url && (
          <a 
            href={note.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-2 text-blue-400 hover:text-blue-300 text-sm inline-flex items-center"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            {note.url.length > 30 ? `${note.url.substring(0, 30)}...` : note.url}
          </a>
        )}
      </CardContent>
      
      <Separator className="bg-gray-800" />
      
      <CardFooter className="p-4 flex flex-col items-start">
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.map((tag) => (
            <Badge 
              key={tag.id} 
              variant="outline" 
              className="bg-gray-800 hover:bg-gray-700 border-gray-700 text-xs"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => onEdit(note)}
          >
            <Pencil className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            className="text-xs"
            onClick={() => onDelete(note.id)}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
