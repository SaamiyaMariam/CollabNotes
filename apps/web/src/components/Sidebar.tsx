import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useGetFoldersQuery,
  useGetNotesByFolderIdLazyQuery,
} from "../generated/graphql";
import StickyNoteIcon from "./icons/StickyNoteIcon";
import FolderIcon from "./icons/FolderIcon";

interface SidebarProps {
  currentNoteId?: string;
  folderId?: string | null;
}

export default function Sidebar({ currentNoteId, folderId }: SidebarProps) {
  const navigate = useNavigate();
  const { data: foldersData } = useGetFoldersQuery();
  const [expanded, setExpanded] = useState(true);

  const [getNotesByFolderId] = useGetNotesByFolderIdLazyQuery();
  const [notes, setNotes] = useState<any[]>([]);

  const folder = foldersData?.folders?.find((f) => f.id === folderId);

  console.log("📁 All Folders:", foldersData);
  console.log("🟢 Selected Folder ID:", folderId);
  console.log("🟣 Matched Folder Object:", folder);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!folderId) {
        console.warn("⚠️ No folderId provided to Sidebar");
        return;
      }
      console.log("📨 Fetching notes for folder:", folderId);
      const { data } = await getNotesByFolderId({ variables: { folderId } });
      console.log("🧾 Notes fetched:", data);
      setNotes(data?.notes ?? []);
    };
    fetchNotes();
  }, [folderId, getNotesByFolderId]);

  return (
    <aside
    className={`relative flex flex-col justify-between py-6 border-r border-white/60 bg-white/70 backdrop-blur-sm rounded-r-3xl mt-[8px] overflow-hidden transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        expanded ? "w-64 px-4" : "w-16 items-center gap-5"
    }`}
    >
      <div className="flex flex-col gap-3">
        {/* Navigation */}
        <button onClick={() => navigate("/app")}
        className={`flex items-center gap-2 p-2 rounded-xl text-gray-600 hover:text-[#eb8db5] hover:bg-white transition ${
            expanded ? "justify-start" : "justify-center"
        }`}>
          <Home size={20} />
          {expanded && <span
            className={`block whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            expanded
                ? "opacity-100 w-auto delay-200 ml-2"
                : "opacity-0 w-0 ml-0"
            }`}
        >
    Dashboard</span>}
        </button>

        <button onClick={() => navigate("/trash")} 
        className={`flex items-center gap-2 p-2 rounded-xl text-gray-600 hover:text-[#eb8db5] hover:bg-white transition duration-300 overflow-hidden whitespace-nowrap ${
            expanded ? "justify-start opacity-100 delay-300" : "justify-center"
        }`}>
        <Trash2 size={20} />
          {expanded && <span
            className={`block whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            expanded
                ? "opacity-100 w-auto delay-200 ml-2"
                : "opacity-0 w-0 ml-0"
            }`}
        >
    Recycle Bin</span>}
        </button>

        {/* Folder and notes */}
        {folder && (
          <div className="mt-2 flex flex-col">
            {expanded ? (
                <button
                    className="text-left text-sm font-semibold px-3 py-3 rounded-lg w-full transition"
                    onClick={() => navigate(`/${folder.url}`)}
                    style={{
                    backgroundColor: `${folder.color}30`,
                    color: "#4b5563",
                    }}
                >
                    {folder.name}
                </button>
                ) : (
                <button
                    onClick={() => navigate(`/${folder.url}`)}
                    className="px-8 rounded-xl hover:bg-white/80 transition"
                    title={folder.name} // Tooltip for collapsed state
                >
                    <FolderIcon/>
                </button>
                )}
            <div className="mt-2 flex flex-col">
                {notes.map((note) => {
                const baseColor = note.color || "#a8d1e7"; // fallback color
                return (
                    <button
                    key={note.id}
                    onClick={() => navigate(`/note/${note.url}`)}
                    className={`text-left px-8 py-2 mt-2 rounded-lg text-sm font-medium transition ${
                        note.id === currentNoteId
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                    style={{
                        backgroundColor:
                        note.id === currentNoteId ? baseColor : "transparent",
                    }}
                    onMouseEnter={(e) => {
                        if (note.id !== currentNoteId)
                        (e.currentTarget.style.backgroundColor = `${baseColor}33`); // light hover (20% opacity)
                    }}
                    onMouseLeave={(e) => {
                        if (note.id !== currentNoteId)
                        (e.currentTarget.style.backgroundColor = "transparent");
                    }}
                    >
                    {expanded ? note.title : (
                        <StickyNoteIcon/>
                        )}
                    </button>
                );
                })}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="self-right mt-4 bg-white rounded-full shadow-sm p-1 hover:bg-gray-100 transition"
      >
        {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    </aside>
  );
}
