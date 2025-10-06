import type { GetNotesQuery } from "../../generated/graphql";
import "../../styles/NoteCard.css";
import Checkbox from "../../components/Checkbox";

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
      <Checkbox
        checked={selected}
        onChange={(e) => {
          e.stopPropagation();
          onSelectToggle();
        }}
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
