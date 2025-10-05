import type { GetNotesQuery } from "../../generated/graphql";
import "../../styles/NoteCard.css";

type Note = GetNotesQuery["notes"][0];

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

export default function NoteCard({ note, onClick }: NoteCardProps) {
  return (
    <div
      className="note-card"
      onClick={onClick}
      style={{
        backgroundColor: note.color || "#cfb5eb",
      }}
    >
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
  );
}
