import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useGetFoldersQuery,
  useGetNotesByFolderIdLazyQuery,
} from "../generated/graphql";

interface SidebarProps {
  currentNoteId?: string;
  folderId?: string | null;
}

export default function Sidebar({ currentNoteId, folderId }: SidebarProps) {
  const navigate = useNavigate();
  const { data: foldersData } = useGetFoldersQuery();
  const [expanded, setExpanded] = useState(true);

  // Use LazyQuery for folder notes
  const [getNotesByFolderId] = useGetNotesByFolderIdLazyQuery();
  const [folderNotes, setFolderNotes] = useState<Record<string, any[]>>({});

  // Fetch notes for all folders once they load
  useEffect(() => {
    const fetchAllNotes = async () => {
      if (!foldersData?.folders) return;
      const results: Record<string, any[]> = {};

      for (const f of foldersData.folders) {
        const { data } = await getNotesByFolderId({
          variables: { folderId: f.id },
        });
        results[f.id] = data?.notes ?? [];
      }

      setFolderNotes(results);
    };

    fetchAllNotes();
  }, [foldersData]);

  return (
    <aside
      className={`relative transition-all duration-300 border-r border-white/60 bg-white/70 backdrop-blur-sm rounded-r-3xl mt-[8px]
      ${expanded ? "w-64 px-4" : "w-16 items-center gap-5"} flex flex-col justify-between py-6`}
    >
      {/* --- Top Navigation --- */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => navigate("/app")}
          className={`flex items-center gap-2 p-2 rounded-xl transition ${
            expanded ? "justify-start" : "justify-center"
          } text-gray-600 hover:text-[#eb8db5] hover:bg-white`}
        >
          <Home size={20} />
          {expanded && <span>Dashboard</span>}
        </button>

        <button
          onClick={() => navigate("/trash")}
          className={`flex items-center gap-2 p-2 rounded-xl transition ${
            expanded ? "justify-start" : "justify-center"
          } text-gray-600 hover:text-[#eb8db5] hover:bg-white`}
        >
          <Trash2 size={20} />
          {expanded && <span>Recycle Bin</span>}
        </button>

        {/* --- Folder Section --- */}
        {foldersData?.folders?.map((folder) => (
          <div key={folder.id} className="mt-3">
            {expanded && (
              <h3
                className="text-sm font-semibold px-2 py-1 rounded-lg"
                style={{
                  backgroundColor: `${folder.color}30`,
                  color: "#4b5563",
                }}
              >
                {folder.name}
              </h3>
            )}

            <div className="mt-1 flex flex-col">
              {folderNotes[folder.id]?.map((note) => (
                <button
                  key={note.id}
                  onClick={() => navigate(`/note/${note.url}`)}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                    note.id === currentNoteId
                      ? "bg-[#a8d1e7] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {expanded ? note.title : "📝"}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* --- Bottom Collapse Button --- */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="self-center mt-4 bg-white rounded-full shadow-sm p-1 hover:bg-gray-100 transition"
      >
        {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    </aside>
  );
}
