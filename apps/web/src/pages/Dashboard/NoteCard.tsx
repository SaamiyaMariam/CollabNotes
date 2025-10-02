import type { GetNotesQuery } from "../../generated/graphql";
import { FileText } from "lucide-react";

type Note = GetNotesQuery["notes"][0];

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

export default function NoteCard({ note, onClick }: NoteCardProps) {
  return (
    <div
      onClick={onClick}
      className="p-5 rounded-xl shadow-sm bg-white cursor-pointer hover:shadow-md transition flex flex-col gap-2 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <FileText className="text-indigo-600" size={22} />
        {note.color && (
          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: note.color }}
          ></span>
        )}
      </div>
      <h3 className="font-semibold text-gray-800 truncate">{note.title}</h3>
    </div>
  );
}
