import type { GetNotesQuery } from "../../generated/graphql";
import "../../styles/NoteCard.css";

type Note = GetNotesQuery["notes"][0];

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  selected: boolean;
  onSelectToggle: () => void;
}

export default function NoteCard({ note, onClick, selected, onSelectToggle }: NoteCardProps) {
  return (
    <div
      className="note-card"
      style={{
        backgroundColor: note.color || "#cfb5eb",
      }}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => {
          e.stopPropagation();
          onSelectToggle();
        }}
        className="absolute top-2 left-2 h-4 w-4 accent-[#eb8db5] cursor-pointer z-10"
      />
      
      <div onClick={onClick} className="w-full h-full cursor-pointer flex flex-col justify-between">
        <div className="note-wrapper"></div>
        <div className="note-info">
          <h3 className="note-title">{note.title}</h3>
          <p className="note-subtitle">
            {note.updatedAt
              ? `Updated ${new Date(note.updatedAt).toLocaleDateString()}`
              : "No updates yet"}
          </p>
        </div>
      </div>
    </div>
  );
}
